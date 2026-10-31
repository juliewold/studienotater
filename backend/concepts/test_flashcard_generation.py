import json
from unittest.mock import Mock, patch
from .auth_test_utils import AuthenticatedAITestCase
from .flashcard_generation_service import generate_flashcards


def response(data):
    return Mock(choices=[Mock(finish_reason='stop', message=Mock(content=json.dumps(data)))])


def card(question='Hva gjør en stack?', answer='LIFO.', point='stack', evidence='En stack bruker LIFO.'):
    return dict(question=question, answer=answer, learningPoint=point, evidence=evidence)


class FlashcardGenerationTests(AuthenticatedAITestCase):
    def run_generation(self, outputs, text='En stack bruker LIFO.', topics=None):
        client = Mock()
        client.chat.completions.create.side_effect = [response(o) for o in outputs]
        with patch('concepts.flashcard_generation_service.get_client', return_value=client):
            cards = generate_flashcards(text, topics or [])
        return cards, client

    def test_content_prompt_has_no_taxonomy_and_preserves_math(self):
        cards, client = self.run_generation([
            {'flashcards': [card()]},
            {'placements': [{'cardId': 'c0', 'subtopicId': 'stack'}]},
        ], '<h2>Datastrukturer</h2><p>En stack bruker LIFO.</p><span data-latex="n^2"></span>',
            [{'id': 'stack', 'name': 'Stack', 'topicName': 'Datastrukturer'},
             {'id': 'old', 'name': 'Problem reductions', 'topicName': 'Algoritmer'}])
        payload = json.loads(client.chat.completions.create.call_args_list[0].kwargs['messages'][1]['content'])
        self.assertEqual(set(payload), {'note'})
        self.assertIn('$n^2$', payload['note'])
        self.assertIn('Datastrukturer\nEn stack', payload['note'])
        self.assertEqual(cards, [{'question': 'Hva gjør en stack?', 'answer': 'LIFO.', 'subtopicId': 'stack'}])

    def test_reordered_classifications_use_card_ids(self):
        cards, _ = self.run_generation([
            {'flashcards': [card(), card('Hva gjør en kø?', 'FIFO.', 'queue', 'En kø bruker FIFO.')]},
            {'placements': [{'cardId': 'c1', 'subtopicId': 'queue'}, {'cardId': 'c0', 'subtopicId': 'stack'}]},
        ], 'En stack bruker LIFO. En kø bruker FIFO.', [{'id': 'stack'}, {'id': 'queue'}])
        self.assertEqual([c['subtopicId'] for c in cards], ['stack', 'queue'])

    def test_duplicates_and_same_learning_point_are_removed(self):
        cards, _ = self.run_generation([{'flashcards': [card(), card('Hva kjennetegner en stack?'),
            card('Hva gjør en stack?', point='other'), card('Hva gjør en stack da?', point='third')]}])
        self.assertEqual(len(cards), 1)

    def test_distinct_formulas_are_preserved(self):
        cards, _ = self.run_generation([{'flashcards': [
            card('Når er x < 0?', 'Negativ.', 'negative', 'x < 0 er negativ.'),
            card('Når er x > 0?', 'Positiv.', 'positive', 'x > 0 er positiv.'),
        ]}], 'x < 0 er negativ. x > 0 er positiv.')
        self.assertEqual(len(cards), 2)

    def test_ungrounded_output_retries(self):
        with self.assertLogs('concepts.flashcard_generation_service'):
            cards, client = self.run_generation([
                {'flashcards': [card(evidence='Invented source')]}, {'flashcards': [card()]},
            ])
        self.assertEqual(len(cards), 1)
        self.assertEqual(client.chat.completions.create.call_count, 2)

    def test_repeated_invalid_output_fails(self):
        with self.assertLogs('concepts.flashcard_generation_service'), self.assertRaises(ValueError):
            self.run_generation([{'flashcards': [card(evidence='Wrong')]}, {'flashcards': [{}]}])

    def test_uncertain_unknown_missing_duplicate_placements_require_user_choice(self):
        for placements in [[], [{'cardId': 'c0', 'subtopicId': None}],
                           [{'cardId': 'c0', 'subtopicId': 'foreign'}],
                           [{'cardId': 'c0', 'subtopicId': 'stack'}] * 2]:
            with self.subTest(placements=placements):
                cards, _ = self.run_generation([{'flashcards': [card()]}, {'placements': placements}], topics=[{'id': 'stack'}])
                self.assertIsNone(cards[0]['subtopicId'])

    def test_no_taxonomy_and_empty_source_result(self):
        cards, client = self.run_generation([{'flashcards': []}])
        self.assertEqual(cards, [])
        self.assertEqual(client.chat.completions.create.call_count, 1)

    def test_api_allows_unlinked_notes(self):
        with patch('concepts.views.generate_flashcards', return_value=[]) as generate:
            result = self.client.post('/api/concepts/generate-flashcards/', data=json.dumps({'text': 'Kilde', 'subtopics': []}), content_type='application/json')
        self.assertEqual(result.status_code, 200)
        generate.assert_called_once_with('Kilde', [])
