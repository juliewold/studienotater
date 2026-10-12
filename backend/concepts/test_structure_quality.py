import copy
import json
from unittest.mock import Mock, patch
from django.test import SimpleTestCase
from .subject_structure_service import generate_subject_structure
from .structure_note_assignment import note_text


class StructureQualityTests(SimpleTestCase):
    notes = [
        {"id": "id-data", "title": "Forelesning 2a - Datastrukturer", "content": "<h2>Stakker og køer</h2><p>Tabeller, lenkede lister og hashtabeller organiserer data.</p>"},
        {"id": "id-reductions", "title": "Forelesning 2b - Problemer og reduksjoner", "content": "<h2>Reduksjoner</h2><p>Turing, Cook, Levin og Karp transformerer problemer. Rekursjon nevnes som et eksempel.</p>"},
        {"id": "id-divide", "title": "Splitt og hersk", "content": "<p>Merge Sort deler problemet og kombinerer løsninger rekursivt.</p>"},
    ]
    plan = {"topics": [
        {"name": "Data structures", "subtopics": [{"name": "Stacks and queues", "noteIds": ["id-divide"]}]},
        {"name": "Problem reductions", "subtopics": [{"name": "Reductions", "noteIds": ["id-data"]}]},
        {"name": "Divide and conquer", "subtopics": [{"name": "Merge Sort", "noteIds": ["id-reductions"]}]},
    ]}

    def run_plan(self, notes=None, plan=None, existing=None, invalid=None):
        calls = []
        def respond(**kwargs):
            payload = json.loads(kwargs["messages"][1]["content"])
            calls.append(payload)
            if "notes" in payload:
                result = plan if plan is not None else self.plan
            else:
                note = payload["note"]
                if "Datastrukturer" in note["title"]:
                    target, evidence = "Data structures", "Tabeller, lenkede lister og hashtabeller organiserer data."
                elif "Problemer" in note["title"]:
                    target, evidence = "Problem reductions", "Turing, Cook, Levin og Karp transformerer problemer."
                else:
                    target, evidence = "Divide and conquer", "Merge Sort deler problemet og kombinerer løsninger rekursivt."
                choice = next(item["key"] for item in payload["choices"] if item["topic"] == target)
                result = invalid if invalid is not None else {"choice": choice, "evidence": evidence, "reason": "Dette er notatets hovedtema."}
            return Mock(choices=[Mock(finish_reason="stop", message=Mock(content=json.dumps(result)))])
        client = Mock()
        client.chat.completions.create.side_effect = respond
        with patch("concepts.subject_structure_service.get_client", return_value=client):
            result = generate_subject_structure("Algorithms", notes or self.notes, existing)
        return result, calls

    def test_shifted_batch_ids_are_replaced_by_independent_assignments(self):
        for order in [self.notes, list(reversed(self.notes))]:
            result, calls = self.run_plan(notes=order)
            mapping = {topic["name"]: topic["subtopics"][0]["noteIds"] for topic in result["topics"]}
            self.assertEqual(mapping, {"Data structures": ["id-data"], "Problem reductions": ["id-reductions"], "Divide and conquer": ["id-divide"]})
            self.assertEqual(len(calls), 4)
            for call, source in zip(calls[1:], order):
                self.assertEqual(call["note"]["title"], source["title"])
                self.assertNotIn("id", call["note"])
                self.assertNotIn("notes", call)
                self.assertTrue(all("noteIds" not in choice for choice in call["choices"]))

    def test_existing_option_omitted_from_plan_remains_available(self):
        existing = [{"id": "old-topic", "name": "Data structures", "subtopics": [{"id": "old-sub", "name": "Data structures fundamentals"}]}]
        plan = {"topics": [{"name": "Problem reductions", "subtopics": [{"name": "Reductions", "noteIds": ["id-data"]}]}]}
        original = copy.deepcopy(existing)
        result, _ = self.run_plan(notes=[self.notes[0]], plan=plan, existing=existing)
        self.assertEqual(result["topics"][0]["subtopics"][0]["noteIds"], [])
        self.assertEqual(result["topics"][1]["subtopics"][0]["id"], "old-sub")
        self.assertEqual(result["topics"][1]["subtopics"][0]["noteIds"], ["id-data"])
        self.assertEqual(existing, original)

    def test_protected_note_is_context_only(self):
        notes = copy.deepcopy(self.notes)
        notes[1]["organize"] = False
        result, calls = self.run_plan(notes=notes)
        self.assertEqual(len(calls), 3)
        ids = [i for topic in result["topics"] for sub in topic["subtopics"] for i in sub["noteIds"]]
        self.assertNotIn("id-reductions", ids)

    def test_bad_or_other_note_evidence_rejects_entire_plan(self):
        for invalid in [
            {"choice": None, "evidence": "", "reason": "Uncertain"},
            {"choice": "unknown", "evidence": "long enough source", "reason": "Reason"},
            {"choice": "s0", "evidence": "Turing, Cook, Levin og Karp transformerer problemer.", "reason": "Other note"},
            {"choice": "s0", "evidence": "Tabeller", "reason": "Too short"},
        ]:
            with self.subTest(invalid=invalid), self.assertRaises(ValueError):
                self.run_plan(invalid=invalid)

    def test_full_text_preserves_boundaries_math_and_tail_without_html_noise(self):
        html = '<h2>Stakker</h2><p>A &amp; B</p><p>' + 'Lang tekst. ' * 5000 + '</p><span data-latex="n^2"></span><p>Viktig slutt.</p><script>ignore()</script>'
        text = note_text(html)
        self.assertIn('Stakker\nA & B\n', text)
        self.assertIn('$n^2$', text)
        self.assertTrue(text.endswith('Viktig slutt.'))
        self.assertNotIn('ignore()', text)
        self.assertNotIn('<', text)

    def test_truncated_valid_json_is_rejected_before_assignment(self):
        client = Mock()
        client.chat.completions.create.return_value = Mock(choices=[Mock(finish_reason="length", message=Mock(content=json.dumps(self.plan)))])
        with patch("concepts.subject_structure_service.get_client", return_value=client), self.assertRaises(ValueError):
            generate_subject_structure("Subject", self.notes)
        self.assertEqual(client.chat.completions.create.call_count, 1)
