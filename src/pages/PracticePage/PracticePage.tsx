import "./PracticePage.css";
import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  Layers3,
  ListChecks,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Target,
} from "lucide-react";

import { practiceTopics } from "../../data/practiceTopics";
import {
  practiceQuestions,
  type PracticeQuestion,
} from "../../data/practiceQuestions";
import { MathText } from "../../components/MathText/MathText";
import { getPracticeStatistics } from "../../services/practice/practiceStatistics";
import {
  savePracticeSession,
  type StoredPracticeAnswer,
} from "../../services/practice/practiceStorage";

type QuestionType = "mixed" | "multiple-choice" | "number-answer";

type Difficulty = "mixed" | "easy" | "medium" | "hard";

type QuestionAmount = 5 | 10 | 20 | "all";

type PracticeStage = "setup" | "session" | "result";

export const PracticePage = () => {
  const { subjectId } = useParams();

  const topics = practiceTopics[subjectId as keyof typeof practiceTopics] ?? [];

  const [statisticsVersion, setStatisticsVersion] = useState(0);

  const statistics = useMemo(
    () =>
      subjectId
        ? getPracticeStatistics(subjectId)
        : {
            totalSessions: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            accuracy: 0,
            bestSession: 0,
          },
    [subjectId, statisticsVersion],
  );

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

  const [sessionStartedAt, setSessionStartedAt] = useState("");

  const [sessionAnswers, setSessionAnswers] = useState<StoredPracticeAnswer[]>(
    [],
  );

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

  const actualQuestionAmount =
    questionAmount === "all"
      ? availableQuestions.length
      : Math.min(questionAmount, availableQuestions.length);

  const estimatedMinutes = Math.max(1, Math.round(actualQuestionAmount * 1.5));

  const selectedQuestionTypeLabel = {
    mixed: "Blandet",
    "multiple-choice": "Flervalg",
    "number-answer": "Tallsvar",
  }[questionType];

  const selectedDifficultyLabel = {
    mixed: "Blandet",
    easy: "Lett",
    medium: "Middels",
    hard: "Vanskelig",
  }[difficulty];

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
    setSessionAnswers([]);
    setSessionStartedAt(new Date().toISOString());
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
    if (!currentQuestion || isAnswerChecked || !subjectId) {
      return;
    }

    const answerIsCorrect = isCurrentAnswerCorrect();

    if (answerIsCorrect) {
      setCorrectAnswers((currentCorrectAnswers) => currentCorrectAnswers + 1);
    }

    const storedAnswer: StoredPracticeAnswer = {
      questionId: currentQuestion.id,
      subjectId,
      topic: currentQuestion.topic,
      difficulty: currentQuestion.difficulty,
      questionType: currentQuestion.type,
      correct: answerIsCorrect,
      answeredAt: new Date().toISOString(),
    };

    setSessionAnswers((currentAnswers) => [...currentAnswers, storedAnswer]);

    setIsAnswerChecked(true);
  };

  const handleNextQuestion = () => {
    const isLastQuestion = currentQuestionIndex === sessionQuestions.length - 1;

    if (isLastQuestion) {
      if (subjectId && sessionQuestions.length > 0) {
        savePracticeSession({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          subjectId,
          startedAt: sessionStartedAt || new Date().toISOString(),
          completedAt: new Date().toISOString(),
          totalQuestions: sessionQuestions.length,
          correctAnswers,
          answers: sessionAnswers,
        });

        setStatisticsVersion((currentVersion) => currentVersion + 1);
      }

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
    setSessionAnswers([]);
    setSessionStartedAt("");
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

          <h1>
            <MathText>{currentQuestion.question}</MathText>
          </h1>

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

                  <span>
                    <MathText>{option}</MathText>
                  </span>
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
                <p>
                  Riktig svar:{" "}
                  <MathText>{String(currentQuestion.correctAnswer)}</MathText>
                </p>
              )}

              <p>
                <MathText>{currentQuestion.explanation}</MathText>
              </p>
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
            <RotateCcw size={18} />
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

      <section className="practice-hero">
        <div className="practice-hero-icon">
          <Sparkles size={24} />
        </div>

        <div>
          <p className="page-label">Oppgaver</p>

          <h1>Sett sammen en øvingsøkt</h1>

          <p className="practice-intro">
            Velg tema, oppgavetype og nivå. Vi lager en variert økt tilpasset
            valgene dine.
          </p>
        </div>
      </section>

      <div className="practice-setup-layout">
        <div className="practice-settings">
          <section className="practice-section">
            <div className="practice-section-title">
              <div className="practice-step-number">1</div>

              <div>
                <h2>Velg tema</h2>

                <p>Velg ett eller flere temaer du vil øve på.</p>
              </div>
            </div>

            <div className="practice-section-header">
              <p className="selection-count">
                {selectedTopics.length} av {topics.length} temaer valgt
              </p>

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

                    <span className="topic-check">
                      {isSelected && <Check size={15} />}
                    </span>

                    <span>{topic}</span>
                  </label>
                );
              })}
            </div>
          </section>

          <section className="practice-section">
            <div className="practice-section-title">
              <div className="practice-step-number">2</div>

              <div>
                <h2>Velg oppgavetype</h2>

                <p>Bland oppgavetyper eller fokuser på én type.</p>
              </div>
            </div>

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

                <div className="option-card-icon">
                  <Layers3 size={21} />
                </div>

                <div>
                  <strong>Blandet</strong>
                  <span>Flervalg og tallsvar</span>
                </div>
              </label>

              <label
                className={`option-card ${
                  questionType === "multiple-choice"
                    ? "option-card-selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="question-type"
                  checked={questionType === "multiple-choice"}
                  onChange={() => setQuestionType("multiple-choice")}
                />

                <div className="option-card-icon">
                  <ListChecks size={21} />
                </div>

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

                <div className="option-card-icon">
                  <BookOpen size={21} />
                </div>

                <div>
                  <strong>Tallsvar</strong>
                  <span>Skriv inn svaret selv</span>
                </div>
              </label>
            </div>
          </section>

          <section className="practice-section">
            <div className="practice-section-title">
              <div className="practice-step-number">3</div>

              <div>
                <h2>Velg vanskelighetsgrad</h2>

                <p>Tilpass nivået til det du ønsker å trene på.</p>
              </div>
            </div>

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
                  <span>Alle nivåer</span>
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
                  <span>Grunnleggende</span>
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
                  <span>Eksamensnivå</span>
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
                  <span>Mer krevende</span>
                </div>
              </label>
            </div>
          </section>

          <section className="practice-section">
            <div className="practice-section-title">
              <div className="practice-step-number">4</div>

              <div>
                <h2>Velg lengde på økten</h2>

                <p>Ta en kort økt eller jobb deg gjennom alle oppgavene.</p>
              </div>
            </div>

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

                  <strong>{amount}</strong>
                  <span>oppgaver</span>
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

                <strong>Alle</strong>
                <span>
                  {availableQuestions.length > 0
                    ? `${availableQuestions.length} oppgaver`
                    : "tilgjengelige"}
                </span>
              </label>
            </div>
          </section>
        </div>

        <aside className="practice-summary-card">
          <div className="practice-summary-heading">
            <div className="practice-summary-icon">
              <Target size={22} />
            </div>

            <div>
              <p>Økten din</p>
              <h2>Oppsummering</h2>
            </div>
          </div>

          <div className="practice-summary-list">
            <div className="practice-summary-row">
              <div>
                <SlidersHorizontal size={18} />
                <span>Temaer</span>
              </div>

              <strong>{selectedTopics.length}</strong>
            </div>

            <div className="practice-summary-row">
              <div>
                <Layers3 size={18} />
                <span>Oppgavetype</span>
              </div>

              <strong>{selectedQuestionTypeLabel}</strong>
            </div>

            <div className="practice-summary-row">
              <div>
                <Target size={18} />
                <span>Nivå</span>
              </div>

              <strong>{selectedDifficultyLabel}</strong>
            </div>

            <div className="practice-summary-row">
              <div>
                <ListChecks size={18} />
                <span>Oppgaver</span>
              </div>

              <strong>{actualQuestionAmount}</strong>
            </div>

            <div className="practice-summary-row">
              <div>
                <Clock3 size={18} />
                <span>Estimert tid</span>
              </div>

              <strong>ca. {estimatedMinutes} min</strong>
            </div>
          </div>

          {selectedTopics.length === 0 && (
            <p className="practice-warning">
              Velg minst ett tema for å starte.
            </p>
          )}

          {selectedTopics.length > 0 && availableQuestions.length === 0 && (
            <p className="practice-warning">
              Det finnes ingen oppgaver som passer til dette utvalget ennå.
            </p>
          )}

          {selectedTopics.length > 0 && availableQuestions.length > 0 && (
            <div className="available-question-count">
              <Check size={17} />

              <span>
                {availableQuestions.length} oppgaver passer til valgene dine.
              </span>
            </div>
          )}

          {questionAmount !== "all" &&
            availableQuestions.length > 0 &&
            availableQuestions.length < questionAmount && (
              <p className="practice-info">
                Du har valgt {questionAmount} oppgaver, men bare{" "}
                {availableQuestions.length} passer. Økten vil derfor inneholde{" "}
                {availableQuestions.length}.
              </p>
            )}

          <hr className="practice-divider" />

          <div className="practice-stats">
            <h3>Din statistikk</h3>

            <div className="practice-stat">
              <span>Økter</span>
              <strong>{statistics.totalSessions}</strong>
            </div>

            <div className="practice-stat">
              <span>Besvarte oppgaver</span>
              <strong>{statistics.totalQuestions}</strong>
            </div>

            <div className="practice-stat">
              <span>Treffprosent</span>
              <strong>{statistics.accuracy}%</strong>
            </div>

            <div className="practice-stat">
              <span>Beste økt</span>
              <strong>{statistics.bestSession}%</strong>
            </div>
          </div>

          <button
            type="button"
            className="start-practice-button practice-summary-start"
            disabled={
              selectedTopics.length === 0 || availableQuestions.length === 0
            }
            onClick={handleStartPractice}
          >
            <Play size={19} />
            Start øving
            <ChevronRight size={19} />
          </button>
        </aside>
      </div>
    </main>
  );
};
