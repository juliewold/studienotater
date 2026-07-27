import "./PracticePage.css";
import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { practiceTopics } from "../../data/practiceTopics";
import {
  practiceQuestions,
  type PracticeQuestion,
} from "../../data/practiceQuestions";

type QuestionType = "mixed" | "multiple-choice" | "number-answer";

type Difficulty = "mixed" | "easy" | "medium" | "hard";
type QuestionAmount = 5 | 10 | 20 | "all";

type PracticeStage = "setup" | "session" | "result";

export const PracticePage = () => {
  const { subjectId } = useParams();

  const topics = practiceTopics[subjectId as keyof typeof practiceTopics] ?? [];

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const [questionType, setQuestionType] = useState<QuestionType>("mixed");

  const [difficulty, setDifficulty] = useState<Difficulty>("mixed");

  const [questionAmount, setQuestionAmount] = useState<QuestionAmount>(10);

  const [stage, setStage] = useState<PracticeStage>("setup");

  const [sessionQuestions, setSessionQuestions] = useState<PracticeQuestion[]>(
    [],
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [selectedOption, setSelectedOption] = useState("");

  const [numberAnswer, setNumberAnswer] = useState("");

  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  const [correctAnswers, setCorrectAnswers] = useState(0);

  const currentQuestion = sessionQuestions[currentQuestionIndex];

  const availableQuestions = useMemo(() => {
    return practiceQuestions.filter((question) => {
      const belongsToSubject = question.subjectId === subjectId;

      const hasSelectedTopic = selectedTopics.includes(question.topic);

      const hasSelectedType =
        questionType === "mixed" || question.type === questionType;

      const hasSelectedDifficulty =
        difficulty === "mixed" || question.difficulty === difficulty;

      return (
        belongsToSubject &&
        hasSelectedTopic &&
        hasSelectedType &&
        hasSelectedDifficulty
      );
    });
  }, [difficulty, questionType, selectedTopics, subjectId]);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((currentTopics) =>
      currentTopics.includes(topic)
        ? currentTopics.filter((currentTopic) => currentTopic !== topic)
        : [...currentTopics, topic],
    );
  };

  const selectAllTopics = () => {
    setSelectedTopics(topics);
  };

  const clearAllTopics = () => {
    setSelectedTopics([]);
  };

  const shuffleQuestions = (questions: PracticeQuestion[]) => {
    return [...questions].sort(() => Math.random() - 0.5);
  };

  const createBalancedSession = (
    questions: PracticeQuestion[],
    amount: QuestionAmount,
  ) => {
    const questionsByTopic = selectedTopics
      .map((topic) => ({
        topic,
        questions: shuffleQuestions(
          questions.filter((question) => question.topic === topic),
        ),
      }))
      .filter((topicGroup) => topicGroup.questions.length > 0);

    const balancedQuestions: PracticeQuestion[] = [];
    let questionIndex = 0;

    while (
      questionsByTopic.some(
        (topicGroup) => topicGroup.questions.length > questionIndex,
      )
    ) {
      for (const topicGroup of questionsByTopic) {
        const question = topicGroup.questions[questionIndex];

        if (question) {
          balancedQuestions.push(question);
        }
      }

      questionIndex += 1;
    }

    const shuffledBalancedQuestions = shuffleQuestions(balancedQuestions);

    if (amount === "all") {
      return shuffledBalancedQuestions;
    }

    return shuffledBalancedQuestions.slice(0, amount);
  };

  const handleStartPractice = () => {
    if (selectedTopics.length === 0 || availableQuestions.length === 0) {
      return;
    }

    const selectedQuestions = createBalancedSession(
      availableQuestions,
      questionAmount,
    );

    setSessionQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setSelectedOption("");
    setNumberAnswer("");
    setIsAnswerChecked(false);
    setStage("session");
  };

  const isCurrentAnswerCorrect = () => {
    if (!currentQuestion) {
      return false;
    }

    if (currentQuestion.type === "multiple-choice") {
      return selectedOption === currentQuestion.correctAnswer;
    }

    const parsedAnswer = Number(numberAnswer);

    return (
      Number.isFinite(parsedAnswer) &&
      parsedAnswer === currentQuestion.correctAnswer
    );
  };

  const handleCheckAnswer = () => {
    if (!currentQuestion || isAnswerChecked) {
      return;
    }

    if (isCurrentAnswerCorrect()) {
      setCorrectAnswers((currentCorrectAnswers) => currentCorrectAnswers + 1);
    }

    setIsAnswerChecked(true);
  };

  const handleNextQuestion = () => {
    const isLastQuestion = currentQuestionIndex === sessionQuestions.length - 1;

    if (isLastQuestion) {
      setStage("result");
      return;
    }

    setCurrentQuestionIndex((currentIndex) => currentIndex + 1);

    setSelectedOption("");
    setNumberAnswer("");
    setIsAnswerChecked(false);
  };

  const handleRestart = () => {
    setStage("setup");
    setSessionQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedOption("");
    setNumberAnswer("");
    setIsAnswerChecked(false);
    setCorrectAnswers(0);
  };

  if (stage === "session" && currentQuestion) {
    const answerIsCorrect = isCurrentAnswerCorrect();

    const hasAnswer =
      currentQuestion.type === "multiple-choice"
        ? selectedOption !== ""
        : numberAnswer.trim() !== "";

    return (
      <main className="practice-page">
        <Link to={`/fag/${subjectId}`} className="back-link">
          ← Tilbake til faget
        </Link>

        <section className="question-section">
          <div className="question-header">
            <span>
              Oppgave {currentQuestionIndex + 1} av {sessionQuestions.length}
            </span>

            <span>{currentQuestion.topic}</span>
          </div>

          <div className="question-progress">
            <div
              className="question-progress-fill"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / sessionQuestions.length) * 100
                }%`,
              }}
            />
          </div>

          <h1>{currentQuestion.question}</h1>

          {currentQuestion.type === "multiple-choice" && (
            <div className="answer-options">
              {currentQuestion.options.map((option) => (
                <label
                  key={option}
                  className={`answer-option ${
                    selectedOption === option ? "answer-option-selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={selectedOption === option}
                    disabled={isAnswerChecked}
                    onChange={() => setSelectedOption(option)}
                  />

                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === "number-answer" && (
            <div className="number-answer-wrapper">
              <label htmlFor="number-answer">Skriv inn svaret</label>

              <input
                id="number-answer"
                type="number"
                value={numberAnswer}
                disabled={isAnswerChecked}
                onChange={(event) => setNumberAnswer(event.target.value)}
              />
            </div>
          )}

          {isAnswerChecked && (
            <div
              className={`answer-feedback ${
                answerIsCorrect
                  ? "answer-feedback-correct"
                  : "answer-feedback-wrong"
              }`}
            >
              <strong>
                {answerIsCorrect ? "Riktig!" : "Ikke helt riktig"}
              </strong>

              {!answerIsCorrect && (
                <p>Riktig svar: {currentQuestion.correctAnswer}</p>
              )}

              <p>{currentQuestion.explanation}</p>
            </div>
          )}

          {!isAnswerChecked ? (
            <button
              type="button"
              className="start-practice-button"
              disabled={!hasAnswer}
              onClick={handleCheckAnswer}
            >
              Sjekk svar
            </button>
          ) : (
            <button
              type="button"
              className="start-practice-button"
              onClick={handleNextQuestion}
            >
              {currentQuestionIndex === sessionQuestions.length - 1
                ? "Se resultat"
                : "Neste oppgave"}
            </button>
          )}
        </section>
      </main>
    );
  }

  if (stage === "result") {
    const percentage =
      sessionQuestions.length === 0
        ? 0
        : Math.round((correctAnswers / sessionQuestions.length) * 100);

    return (
      <main className="practice-page">
        <section className="result-section">
          <p className="page-label">Resultat</p>

          <h1>Økten er ferdig</h1>

          <div className="result-score">
            {correctAnswers} av {sessionQuestions.length} riktig
          </div>

          <p className="result-percentage">{percentage} %</p>

          <button
            type="button"
            className="start-practice-button"
            onClick={handleRestart}
          >
            Start ny økt
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="practice-page">
      <Link to={`/fag/${subjectId}`} className="back-link">
        ← Tilbake til faget
      </Link>

      <p className="page-label">Oppgaver</p>

      <h1>Øvingsoppgaver</h1>

      <p className="practice-intro">
        Velg temaene og typen oppgaver du vil øve på.
      </p>

      <section className="practice-section">
        <div className="practice-section-header">
          <div>
            <h2>Velg tema</h2>

            <p>
              {selectedTopics.length} av {topics.length} temaer valgt
            </p>
          </div>

          <div className="topic-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={selectAllTopics}
            >
              Velg alle
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={clearAllTopics}
            >
              Fjern alle
            </button>
          </div>
        </div>

        <div className="topics-grid">
          {topics.map((topic) => {
            const isSelected = selectedTopics.includes(topic);

            return (
              <label
                key={topic}
                className={`topic-card ${
                  isSelected ? "topic-card-selected" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleTopic(topic)}
                />

                <span>{topic}</span>
              </label>
            );
          })}
        </div>
      </section>

      <section className="practice-section">
        <h2>Oppgavetype</h2>

        <div className="option-grid">
          <label
            className={`option-card ${
              questionType === "mixed" ? "option-card-selected" : ""
            }`}
          >
            <input
              type="radio"
              name="question-type"
              checked={questionType === "mixed"}
              onChange={() => setQuestionType("mixed")}
            />

            <div>
              <strong>Blandet</strong>
              <span>Flervalg og tallsvar</span>
            </div>
          </label>

          <label
            className={`option-card ${
              questionType === "multiple-choice" ? "option-card-selected" : ""
            }`}
          >
            <input
              type="radio"
              name="question-type"
              checked={questionType === "multiple-choice"}
              onChange={() => setQuestionType("multiple-choice")}
            />

            <div>
              <strong>Flervalg</strong>
              <span>Velg mellom flere alternativer</span>
            </div>
          </label>

          <label
            className={`option-card ${
              questionType === "number-answer" ? "option-card-selected" : ""
            }`}
          >
            <input
              type="radio"
              name="question-type"
              checked={questionType === "number-answer"}
              onChange={() => setQuestionType("number-answer")}
            />

            <div>
              <strong>Tallsvar</strong>
              <span>Skriv inn bare svaret</span>
            </div>
          </label>
        </div>
      </section>

      <section className="practice-section">
        <h2>Vanskelighetsgrad</h2>

        <div className="option-grid difficulty-grid">
          <label
            className={`option-card ${
              difficulty === "mixed" ? "option-card-selected" : ""
            }`}
          >
            <input
              type="radio"
              name="difficulty"
              checked={difficulty === "mixed"}
              onChange={() => setDifficulty("mixed")}
            />

            <div>
              <strong>Blandet</strong>
              <span>Oppgaver på alle nivåer</span>
            </div>
          </label>

          <label
            className={`option-card ${
              difficulty === "easy" ? "option-card-selected" : ""
            }`}
          >
            <input
              type="radio"
              name="difficulty"
              checked={difficulty === "easy"}
              onChange={() => setDifficulty("easy")}
            />

            <div>
              <strong>Lett</strong>
              <span>Grunnleggende oppgaver</span>
            </div>
          </label>

          <label
            className={`option-card ${
              difficulty === "medium" ? "option-card-selected" : ""
            }`}
          >
            <input
              type="radio"
              name="difficulty"
              checked={difficulty === "medium"}
              onChange={() => setDifficulty("medium")}
            />

            <div>
              <strong>Middels</strong>
              <span>Vanlige eksamensoppgaver</span>
            </div>
          </label>

          <label
            className={`option-card ${
              difficulty === "hard" ? "option-card-selected" : ""
            }`}
          >
            <input
              type="radio"
              name="difficulty"
              checked={difficulty === "hard"}
              onChange={() => setDifficulty("hard")}
            />

            <div>
              <strong>Vanskelig</strong>
              <span>Mer krevende oppgaver</span>
            </div>
          </label>
        </div>
      </section>

      <section className="practice-section">
        <h2>Antall oppgaver</h2>

        <div className="amount-options">
          {[5, 10, 20].map((amount) => (
            <label
              key={amount}
              className={`amount-card ${
                questionAmount === amount ? "amount-card-selected" : ""
              }`}
            >
              <input
                type="radio"
                name="question-amount"
                checked={questionAmount === amount}
                onChange={() => setQuestionAmount(amount as QuestionAmount)}
              />

              <span>{amount}</span>
            </label>
          ))}

          <label
            className={`amount-card ${
              questionAmount === "all" ? "amount-card-selected" : ""
            }`}
          >
            <input
              type="radio"
              name="question-amount"
              checked={questionAmount === "all"}
              onChange={() => setQuestionAmount("all")}
            />

            <span>Alle</span>
          </label>
        </div>
      </section>

      {selectedTopics.length > 0 && availableQuestions.length === 0 && (
        <p className="practice-warning">
          Det finnes ingen oppgaver for dette utvalget ennå.
        </p>
      )}

      {selectedTopics.length === 0 && (
        <p className="practice-warning">Velg minst ett tema for å starte.</p>
      )}

      {selectedTopics.length > 0 && availableQuestions.length > 0 && (
        <p className="available-question-count">
          {availableQuestions.length} tilgjengelige oppgaver passer til valgene
          dine.
        </p>
      )}

      <button
        type="button"
        className="start-practice-button"
        disabled={
          selectedTopics.length === 0 || availableQuestions.length === 0
        }
        onClick={handleStartPractice}
      >
        Start øving
      </button>
    </main>
  );
};
