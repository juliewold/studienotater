export type QuestionDifficulty = "easy" | "medium" | "hard";

type BasePracticeQuestion = {
  id: string;
  subjectId: string;
  topic: string;
  difficulty: QuestionDifficulty;
  question: string;
  explanation: string;
};

export type MultipleChoiceQuestion = BasePracticeQuestion & {
  type: "multiple-choice";
  options: string[];
  correctAnswer: string;
};

export type NumberAnswerQuestion = BasePracticeQuestion & {
  type: "number-answer";
  correctAnswer: number;
};

export type PracticeQuestion = MultipleChoiceQuestion | NumberAnswerQuestion;
