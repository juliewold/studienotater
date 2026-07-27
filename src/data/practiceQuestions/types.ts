export type QuestionDifficulty =
  | "easy"
  | "medium"
  | "hard";

export type ExamFrequency =
  | "low"
  | "medium"
  | "high";

export type BasePracticeQuestion = {
  id: string;
  subjectId: string;
  topic: string;
  difficulty: QuestionDifficulty;

  // Metadata (valgfrie)
  tags?: string[];
  estimatedTime?: number;
  examFrequency?: ExamFrequency;
};

export type MultipleChoiceQuestion =
  BasePracticeQuestion & {
    type: "multiple-choice";
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  };

export type NumberAnswerQuestion =
  BasePracticeQuestion & {
    type: "number-answer";
    question: string;
    correctAnswer: number;
    explanation: string;
  };

export type PracticeQuestion =
  | MultipleChoiceQuestion
  | NumberAnswerQuestion;