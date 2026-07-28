import {
  getPracticeSessionsForSubject,
  type StoredPracticeAnswer,
} from "./practiceStorage";

export type QuestionLearningStatus =
  | "new"
  | "learning"
  | "review"
  | "mastered";

export type PracticeQuestionProgress = {
  questionId: string;
  subjectId: string;
  topic: string;
  attempts: number;
  correctAnswers: number;
  incorrectAnswers: number;
  currentCorrectStreak: number;
  bestCorrectStreak: number;
  lastAnsweredAt: string | null;
  lastAnswerCorrect: boolean | null;
  status: QuestionLearningStatus;
};

const calculateCorrectStreaks = (
  answers: StoredPracticeAnswer[],
) => {
  let currentCorrectStreak = 0;
  let bestCorrectStreak = 0;

  for (const answer of answers) {
    if (answer.correct) {
      currentCorrectStreak += 1;

      bestCorrectStreak = Math.max(
        bestCorrectStreak,
        currentCorrectStreak,
      );
    } else {
      currentCorrectStreak = 0;
    }
  }

  return {
    currentCorrectStreak,
    bestCorrectStreak,
  };
};

const getQuestionStatus = (
  answers: StoredPracticeAnswer[],
  currentCorrectStreak: number,
): QuestionLearningStatus => {
  if (answers.length === 0) {
    return "new";
  }

  const latestAnswer = answers.at(-1);

  if (!latestAnswer?.correct) {
    return "review";
  }

  if (currentCorrectStreak >= 3) {
    return "mastered";
  }

  return "learning";
};

export const getQuestionProgressForSubject = (
  subjectId: string,
): Map<string, PracticeQuestionProgress> => {
  const sessions =
    getPracticeSessionsForSubject(subjectId);

  const answersByQuestion = new Map<
    string,
    StoredPracticeAnswer[]
  >();

  for (const session of sessions) {
    for (const answer of session.answers) {
      const currentAnswers =
        answersByQuestion.get(answer.questionId) ?? [];

      currentAnswers.push(answer);

      answersByQuestion.set(
        answer.questionId,
        currentAnswers,
      );
    }
  }

  const progressByQuestion = new Map<
    string,
    PracticeQuestionProgress
  >();

  for (const [
    questionId,
    questionAnswers,
  ] of answersByQuestion.entries()) {
    const sortedAnswers = [...questionAnswers].sort(
      (firstAnswer, secondAnswer) =>
        new Date(firstAnswer.answeredAt).getTime() -
        new Date(secondAnswer.answeredAt).getTime(),
    );

    const correctAnswers = sortedAnswers.filter(
      (answer) => answer.correct,
    ).length;

    const incorrectAnswers =
      sortedAnswers.length - correctAnswers;

    const {
      currentCorrectStreak,
      bestCorrectStreak,
    } = calculateCorrectStreaks(sortedAnswers);

    const latestAnswer = sortedAnswers.at(-1);

    progressByQuestion.set(questionId, {
      questionId,
      subjectId,
      topic: latestAnswer?.topic ?? "",
      attempts: sortedAnswers.length,
      correctAnswers,
      incorrectAnswers,
      currentCorrectStreak,
      bestCorrectStreak,
      lastAnsweredAt:
        latestAnswer?.answeredAt ?? null,
      lastAnswerCorrect:
        latestAnswer?.correct ?? null,
      status: getQuestionStatus(
        sortedAnswers,
        currentCorrectStreak,
      ),
    });
  }

  return progressByQuestion;
};

export const getQuestionProgress = (
  subjectId: string,
  questionId: string,
): PracticeQuestionProgress | null => {
  return (
    getQuestionProgressForSubject(subjectId).get(
      questionId,
    ) ?? null
  );
};

export type TopicMasteryStatistics = {
  topic: string;
  totalQuestions: number;
  newQuestions: number;
  learningQuestions: number;
  reviewQuestions: number;
  masteredQuestions: number;
};

export const getTopicMasteryStatistics = (
  subjectId: string,
  topic: string,
  questionIds: string[],
): TopicMasteryStatistics => {
  const progressByQuestion =
    getQuestionProgressForSubject(subjectId);

  const statistics: TopicMasteryStatistics = {
    topic,
    totalQuestions: questionIds.length,
    newQuestions: 0,
    learningQuestions: 0,
    reviewQuestions: 0,
    masteredQuestions: 0,
  };

  for (const questionId of questionIds) {
    const status =
      progressByQuestion.get(questionId)?.status ??
      "new";

    if (status === "new") {
      statistics.newQuestions += 1;
    }

    if (status === "learning") {
      statistics.learningQuestions += 1;
    }

    if (status === "review") {
      statistics.reviewQuestions += 1;
    }

    if (status === "mastered") {
      statistics.masteredQuestions += 1;
    }
  }

  return statistics;
};