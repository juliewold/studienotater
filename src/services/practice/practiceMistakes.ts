import {
  getPracticeSessionsForSubject,
  type StoredPracticeAnswer,
} from "./practiceStorage";

export const getLatestAnswersByQuestion = (
  subjectId: string,
) => {
  const sessions =
    getPracticeSessionsForSubject(subjectId);

  const answers = sessions.flatMap(
    (session) => session.answers,
  );

  const sortedAnswers = [...answers].sort(
    (firstAnswer, secondAnswer) =>
      new Date(secondAnswer.answeredAt).getTime() -
      new Date(firstAnswer.answeredAt).getTime(),
  );

  const latestAnswers =
    new Map<string, StoredPracticeAnswer>();

  for (const answer of sortedAnswers) {
    if (!latestAnswers.has(answer.questionId)) {
      latestAnswers.set(
        answer.questionId,
        answer,
      );
    }
  }

  return latestAnswers;
};

export const getIncorrectQuestionIds = (
  subjectId: string,
) => {
  const latestAnswers =
    getLatestAnswersByQuestion(subjectId);

  return Array.from(latestAnswers.values())
    .filter((answer) => !answer.correct)
    .map((answer) => answer.questionId);
};

export const getIncorrectQuestionCount = (
  subjectId: string,
) => {
  return getIncorrectQuestionIds(subjectId).length;
};