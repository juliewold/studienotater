import type { CurriculumConfig } from "./types";

// Structure and readings from "Pensumhefte, 2026" in the course's Google Drive folder;
// solutions from its "LF" folder.
// Topic and subtopic IDs refer to the existing Supabase structure for TDT4120.
const drive = (label: string, id: string) => ({ label, url: `https://drive.google.com/file/d/${id}/view` });

export const tdt4120Curriculum: CurriculumConfig = {
  subjectId: "tdt4120",
  source: drive("Pensumhefte 2026", "1bWSbHjqxdYc8brlFkXY8BgVf2VkyI3p5"),
  subtopicUnits: {
    // "Sorting algorithms" also holds Quicksort, which is pensum for lecture 3.
    "2d3f880e-d1a0-460d-8433-f8ef5b82b581": "03",
  },
  units: [
    {
      id: "01", number: "01", resourceNumber: "1", title: "Algoritmer og kompleksitet", part: "Grunnlag",
      readings: ["Innledningen til del I", "Kap. 1", "Kap. 2: innledning, 2.1 og 2.2", "Kap. 3: innledning, 3.1 og 3.2", "Kap. 25: innledning"],
      topicIds: ["695139c5-6c24-4126-8472-9f36f378c7f6"],
      lectureSlides: drive("Forelesning 1 (lysark)", "18u_ZFsarcRplsHUZ_MZY-zIEUJZhBTN6"),
      exercises: [drive("Øving 1: Algoritmer og kompleksitet", "1R_ZZBxTmOKgfqFdav8CT3ITIBeEix8bM"), drive("Løsningsforslag øving 1", "1KN2AxQBMG4h_chcGLFqfWPzlOakHcWUA"), drive("Øvingsforelesning 1", "1zfYZVHibIN1tPAYCQvU_2me8I9JSkVjs")],
    },
    {
      id: "02a", number: "02a", resourceNumber: "2a", title: "Datastrukturer", part: "Grunnlag", supporting: true,
      readings: ["Innledningen til del III", "Kap. 10: innledning, 10.1 og 10.2", "Kap. 11 til og med 11.3.1", "Kap. 16: s. 460–463"],
      topicIds: ["6a43ef49-c8c3-43c3-a772-e3db860d8227"],
      lectureSlides: drive("Forelesning 2a (lysark)", "1WHfJHbqijXl37-vr5iq4aHqCQLE1gWZb"),
      exercises: [drive("Øving 2a: Datastrukturer", "1ciOWzqT78H1JXmuChFm7GFTod4lFRwqU"), drive("Løsningsforslag øving 2a", "18iw2D91PRz3fMoruJB9vhYng1XOgp3N7")],
    },
    {
      id: "02b", number: "02b", resourceNumber: "2b", title: "Problemer og reduksjoner", part: "Grunnlag", supporting: true,
      readings: ["Appendiks B.1 i pensumheftet"],
      topicIds: ["be244068-d01d-470e-bd9a-c6758f8e374f"],
      lectureSlides: drive("Forelesning 2b (lysark)", "1JJTfoI289vlg8xx3Jj__BHSCLMkCZhsN"),
      exercises: [drive("Øving 2b: Problemer og reduksjoner", "1eMtFt93zdbkNgssgsg36Q1BLk4ktcS67"), drive("Løsningsforslag øving 2b", "1b03de0NzBw2qWH36M1m1Hc_EGuHtX9cK")],
    },
    {
      id: "03", number: "03", resourceNumber: "3", title: "Splitt og hersk", part: "Sortering og datastrukturer",
      readings: ["Innledningen til del II", "Kap. 2.3", "Kap. 4: innledning og 4.3–4.5", "Kap. 7", "Appendiks C og D i pensumheftet"],
      topicIds: ["a4fe591e-a6d5-4429-9a99-647b86afc356"],
      lectureSlides: drive("Forelesning 3 (lysark)", "1u4Y9AsGBP6OtRCwI3C2-GCZLAt80yqd_"),
      exercises: [drive("Øving 3: Splitt og hersk", "1E14SjWeQj8vDYzQggZ-XG2sneqe2SGJN"), drive("Løsningsforslag øving 3", "1JA9bpWgnazreq9wXf3G4FebI9TV3vx2t")],
    },
    {
      id: "04", number: "04", resourceNumber: "4", title: "Rangering i lineær tid", part: "Sortering og datastrukturer",
      readings: ["Kap. 8", "Kap. 9"],
      topicIds: ["cc44b842-a3b8-4c92-b159-dc2d2eb8c980"],
      lectureSlides: drive("Forelesning 4 (lysark)", "129eEHRDLGQc_u7yZaou9WdUs4GaH1sq9"),
      exercises: [drive("Øving 4: Rangering i lineær tid", "1E7jTmI9w_ILcUbq7OQkC9FAxh-5qEJbU"), drive("Løsningsforslag øving 4", "1TAQtW8pgMfBqhG6NKFSnngND1K-EYTfx")],
    },
    {
      id: "05", number: "05", resourceNumber: "5", title: "Rotfaste trestrukturer", part: "Sortering og datastrukturer",
      readings: ["Innledningene til del III og V", "Kap. 6", "Kap. 10.3", "Kap. 12"],
      topicIds: ["9014d451-2eab-4712-9be5-14d8a23f3cf3"],
      lectureSlides: drive("Forelesning 5 (lysark)", "15j5337WpjCGh6sdMtvqoOvXfnqPud5nr"),
      exercises: [drive("Øving 5: Rotfaste trestrukturer", "1f7OhuQZKL9HHdOEsPfu1Z3lRes-D-a84"), drive("Løsningsforslag øving 5", "1dERIrYC2p28xgLN_1_2LScwzaTOec8kT")],
    },
    {
      id: "06", number: "06", resourceNumber: "6", title: "Dynamisk programmering", part: "Designmetoder",
      readings: ["Innledningen til del IV", "Kap. 14: innledning, 14.1 og 14.3–14.4", "Appendiks E i pensumheftet"],
      topicIds: ["3b93837d-aea2-42d7-8927-2a5b0d4995e9"],
      lectureSlides: drive("Forelesning 6 (lysark)", "1g7BALBXXgjYgZ7m4Otj8CvAXyp_4_O7D"),
      exercises: [drive("Øving 6: Dynamisk programmering", "108nTn21Gh38QDXRtPzns4lMQNJIQXrmv"), drive("Løsningsforslag øving 6", "1ntaMblw_MU7V3mttggnsODDeVS_bgnAf")],
    },
    {
      id: "07", number: "07", resourceNumber: "7", title: "Grådighet", part: "Designmetoder",
      readings: ["Kap. 15: innledning og 15.1–15.3"],
      topicIds: ["aec6533d-249c-4c38-9b51-12aa1d80104a"],
      lectureSlides: drive("Forelesning 7 (lysark)", "1NIn0N5WVlmqRmDfPIDQCbc3AymqnMwwX"),
      exercises: [drive("Øving 7: Grådighet", "1Kj6HfGppIc8jDov59sqYympJKU-yc9Cq"), drive("Løsningsforslag øving 7", "1ft9Ne2MkfQoovEbv6YEuVlJYEarsvaDa")],
    },
    {
      id: "08", number: "08", resourceNumber: "8", title: "Traversering av grafer", part: "Grafalgoritmer",
      readings: ["Innledningen til del VI", "Kap. 20", "Appendiks F i pensumheftet"], topicIds: ["0fed139f-1278-4283-9d8d-02cc5599b7f2"],
      lectureSlides: drive("Forelesning 8 (lysark)", "1rUEdUctrPWWEtcn8CqNJZiZ-bGS-hxZY"),
      exercises: [drive("Øving 8: Traversering av grafer", "1atk1o59oLThH41l1qXF0wHEbx2SoJ1TR"), drive("Løsningsforslag øving 8", "1Hlg5MZHRkhpVculIThCH_bTwoxI5bXz1")],
    },
    {
      id: "09", number: "09", resourceNumber: "9", title: "Minimale spenntrær", part: "Grafalgoritmer",
      readings: ["Kap. 19: innledning, 19.1 og 19.3", "Kap. 21"], topicIds: ["d24ab642-680e-440b-9f1a-35f893d85115"],
      lectureSlides: drive("Forelesning 9 (lysark)", "1eNDqTQ8ERWHBvQtuNGV1J1sjc7DhhVah"),
      exercises: [drive("Øving 9: Minimale spenntrær", "1VWjZwHR8sM0aZHTgCDOKNqRl6Nwa-ZZw"), drive("Løsningsforslag øving 9", "1TsPVhXVyVgxk96o-pzMJTev4DuEpKlIv")],
    },
    {
      id: "10", number: "10", resourceNumber: "10", title: "Korteste vei fra én til alle", part: "Grafalgoritmer",
      readings: ["Kap. 22: innledning og 22.1–22.3"], topicIds: ["106d24e9-2e23-49cd-a1cb-1204ece731ad"],
      lectureSlides: drive("Forelesning 10 (lysark)", "1I4VJv0qRWJ7XUBHw9o5ApMIj5EY98QIY"),
      exercises: [drive("Øving 10: Korteste vei fra én til alle", "1lJYnbikTj6sFBy3Cp34S8BiEVWQE8z4L")],
    },
    { id: "11", number: "11", resourceNumber: "11", title: "Korteste vei fra alle til alle", part: "Grafalgoritmer", readings: ["Kap. 23: innledning og 23.2"], topicIds: [] },
    { id: "12", number: "12", resourceNumber: "12", title: "Maksimal flyt", part: "Grafalgoritmer", readings: ["Kap. 24"], topicIds: [] },
    {
      id: "13", number: "13", resourceNumber: "13", title: "NP-kompletthet", part: "Kompleksitet",
      readings: ["Kap. 34: innledning og 34.1–34.3", "Appendiks E i pensumheftet", "Appendiks B.2 i pensumheftet"], topicIds: [],
    },
    { id: "14", number: "14", resourceNumber: "14", title: "NP-komplette problemer", part: "Kompleksitet", readings: ["Kap. 34.4 og 34.5"], topicIds: [] },
  ],
};
