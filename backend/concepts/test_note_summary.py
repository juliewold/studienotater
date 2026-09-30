import json
from unittest.mock import Mock, patch
from django.test import SimpleTestCase
from openai import APIConnectionError, APIStatusError
from .note_summary_service import summarize_note


def response(content, finish="stop"):
    return Mock(choices=[Mock(message=Mock(content=content), finish_reason=finish)])


class NoteSummaryTests(SimpleTestCase):
    def test_success_uses_only_note_as_source(self):
        client = Mock()
        client.chat.completions.create.return_value = response('{"summary":"  Kort repetisjon.  "}')
        with patch('concepts.note_summary_service.get_client', return_value=client):
            self.assertEqual(summarize_note('Kildetekst'), 'Kort repetisjon.')
        messages = client.chat.completions.create.call_args.kwargs['messages']
        self.assertEqual(messages[1]['content'], 'STUDIENOTAT:\nKildetekst')
        self.assertIn('Bruk bare', messages[0]['content'])
        self.assertEqual(client.chat.completions.create.call_count, 1)

    def test_invalid_output_retries_and_recovers(self):
        invalid = [response('bad json'), response('[]'), response('{}'), response('{"summary":[]}'),
                   response('{"summary":" "}'), response(''), Mock(choices=[]),
                   response('{"summary":"kort"}', 'length'),
                   response(json.dumps({'summary': 'ord ' * 201})),
                   response(json.dumps({'summary': 'x' * 5001}))]
        for first in invalid:
            client = Mock()
            client.chat.completions.create.side_effect = [first, response('{"summary":"Gyldig"}')]
            with self.subTest(first=first), patch('concepts.note_summary_service.get_client', return_value=client), self.assertLogs('concepts.note_summary_service'):
                self.assertEqual(summarize_note('Kilde'), 'Gyldig')
            self.assertEqual(client.chat.completions.create.call_count, 2)

    def test_exhausted_output_returns_safe_502(self):
        client = Mock()
        client.chat.completions.create.return_value = response('PRIVATE raw output')
        with patch('concepts.note_summary_service.get_client', return_value=client), self.assertLogs('concepts.note_summary_service') as logs:
            result = self.client.post('/api/concepts/summarize-note/', {'text':'PRIVATE note'}, content_type='application/json')
        self.assertEqual(result.status_code, 502)
        self.assertEqual(result.json()['code'], 'invalid_ai_response')
        self.assertNotIn('PRIVATE', str(logs.output) + result.content.decode())
        self.assertEqual(client.chat.completions.create.call_count, 2)

    def test_bad_requests_do_not_call_ai(self):
        for body in ('not json', 'null', '[]', '{}', '{"text":7}', '{"text":" "}'):
            with self.subTest(body=body), patch('concepts.views.summarize_note') as ai:
                result = self.client.post('/api/concepts/summarize-note/', body, content_type='application/json')
                self.assertEqual(result.status_code, 400)
                ai.assert_not_called()
        self.assertEqual(self.client.get('/api/concepts/summarize-note/').status_code, 405)

    def test_transport_errors_are_controlled_without_extra_validation_retry(self):
        for error, status in [(APIConnectionError(request=Mock()), 503),
                              (APIStatusError('private', response=Mock(status_code=500, request=Mock()), body=None), 502)]:
            client = Mock()
            client.chat.completions.create.side_effect = error
            with self.subTest(status=status), patch('concepts.note_summary_service.get_client', return_value=client):
                result = self.client.post('/api/concepts/summarize-note/', {'text':'Note'}, content_type='application/json')
                self.assertEqual(result.status_code, status)
                self.assertNotIn('private', result.content.decode())
            self.assertEqual(client.chat.completions.create.call_count, 1)

    def test_success_endpoint(self):
        with patch('concepts.views.summarize_note', return_value='Summary') as ai:
            result = self.client.post('/api/concepts/summarize-note/', {'text':' Note '}, content_type='application/json')
            self.assertEqual(result.json(), {'summary':'Summary'})
            ai.assert_called_once_with('Note')
