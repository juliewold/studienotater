import "./PracticePage.css";
import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
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
  CheckCircle2,
  XCircle,
  Brain,
  ChevronDown,
  History,
  Trash2,
} from "lucide-react";
import { practiceTopics } from "../../data/practiceTopics";
import {
  practiceQuestions,
  type PracticeQuestion,
} from "../../data/practiceQuestions";
import { MathText } from "../../components/MathText/MathText";
import {
  getPracticeStatistics,
  getPracticeTopicStatistics,
} from "../../services/practice/practiceStatistics";
import {
  clearPracticeSessions,
  clearPracticeSessionsForSubject,
  clearPracticeSessionsForTopic,
  savePracticeSession,
  type StoredPracticeAnswer,
} from "../../services/practice/practiceStorage";
import {
  clearActivePracticeSession,
  clearAllActivePracticeSessions,
  getActivePracticeSession,
  saveActivePracticeSession,
  type ActivePracticeMode,
  type StoredActivePracticeSession,
} from "../../services/practice/practiceActiveSession";
import { getIncorrectQuestionIds } from "../../services/practice/practiceMistakes";

type QuestionType = "mixed" | "multiple-choice" | "number-answer";

type Difficulty = "mixed" | "easy" | "medium" | "hard";

type QuestionAmount = 5 | 10 | 20 | "all";

type PracticeStage = "setup" | "session" | "result";

export const PracticePage = () => {
  const { subjectId } = useParams();

  const topics = practiceTopics[subjectId as keyof typeof practiceTopics] ?? [];

  const topicGroups = [
    {
      title: "📘 Mengder og logikk",
      topics: [
        "Mengder",
        "Relasjoner",
        "Funksjoner",
        "Utsagnslogikk",
        "Predikatlogikk",
        "Bevisteknikker",
      ],
    },
    {
      title: "🔁 Rekursjon og induksjon",
      topics: ["Rekursjon", "Induksjon", "Induktivt definerte mengder"],
    },
    {
      title: "🔢 Tallteori",
      topics: [
        "Delbarhet og primtall",
        "GCD og Euklids algoritme",
        "Diofantiske ligninger",
        "Kongruensregning",
        "Modulære inverser",
        "Kinesisk restteorem",
        "Diskrete logaritmer",
        "RSA",
      ],
    },
    {
      title: "🎲 Kombinatorikk",
      topics: ["Kombinatorikk"],
    },
    {
      title: "📈 Grafteori",
      topics: ["Grafteori", "Trær"],
    },
    {
      title: "🤖 Tilstandsmaskiner og regulære språk",
      topics: ["Automater", "Regulære uttrykk"],
    },
  ];

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

  const topicStatistics = useMemo(() => {
    const storedStatistics = subjectId
      ? getPracticeTopicStatistics(subjectId)
      : [];

    return topics.map((topic) => {
      const storedTopic = storedStatistics.find(
        (statistic) => statistic.topic === topic,
      );

      return (
        storedTopic ?? {
          topic,
          totalQuestions: 0,
          correctAnswers: 0,
          accuracy: 0,
        }
      );
    });
  }, [subjectId, topics, statisticsVersion]);

  const incorrectQuestionIds = useMemo(
    () => (subjectId ? getIncorrectQuestionIds(subjectId) : []),
    [subjectId, statisticsVersion],
  );

  const incorrectQuestions = useMemo(
    () =>
      practiceQuestions.filter(
        (question) =>
          question.subjectId === subjectId &&
          incorrectQuestionIds.includes(question.id),
      ),
    [incorrectQuestionIds, subjectId],
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

  const [completedAnswers, setCompletedAnswers] = useState<
    StoredPracticeAnswer[]
  >([]);

  const [expandedResultQuestions, setExpandedResultQuestions] = useState<
    Set<string>
  >(new Set());

  const [activeSession, setActiveSession] =
    useState<StoredActivePracticeSession | null>(null);

  const [practiceMode, setPracticeMode] =
    useState<ActivePracticeMode>("standard");

  const [resetTopic, setResetTopic] = useState("");

  useEffect(() => {
    if (!subjectId) {
      setActiveSession(null);
      return;
    }

    setActiveSession(getActivePracticeSession(subjectId));
  }, [subjectId]);

  useEffect(() => {
    setResetTopic(topics[0] ?? "");
  }, [subjectId]);

  const currentQuestion = sessionQuestions[currentQuestionIndex];

  useEffect(() => {
    if (stage !== "session" || !subjectId || sessionQuestions.length === 0) {
      return;
    }

    const updatedActiveSession: StoredActivePracticeSession = {
      subjectId,
      questionIds: sessionQuestions.map((question) => question.id),
      currentQuestionIndex,
      selectedOption,
      numberAnswer,
      isAnswerChecked,
      correctAnswers,
      answers: sessionAnswers,
      startedAt: sessionStartedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mode: practiceMode,
    };

    saveActivePracticeSession(updatedActiveSession);

    setActiveSession(updatedActiveSession);
  }, [
    stage,
    subjectId,
    sessionQuestions,
    currentQuestionIndex,
    selectedOption,
    numberAnswer,
    isAnswerChecked,
    correctAnswers,
    sessionAnswers,
    sessionStartedAt,
    practiceMode,
  ]);

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
    setCompletedAnswers([]);
    setSessionStartedAt(new Date().toISOString());
    setSelectedOption("");
    setNumberAnswer("");
    setIsAnswerChecked(false);
    setPracticeMode("standard");
    setStage("session");
    setExpandedResultQuestions(new Set());
  };

  const handleStartMistakePractice = () => {
    if (incorrectQuestions.length === 0) {
      return;
    }

    const selectedQuestions = shuffleQuestions(incorrectQuestions);

    setSessionQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setSessionAnswers([]);
    setCompletedAnswers([]);
    setSessionStartedAt(new Date().toISOString());
    setSelectedOption("");
    setNumberAnswer("");
    setIsAnswerChecked(false);
    setPracticeMode("mistakes");
    setStage("session");
    setExpandedResultQuestions(new Set());
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
      userAnswer:
        currentQuestion.type === "multiple-choice"
          ? selectedOption
          : numberAnswer,
      correct: answerIsCorrect,
      answeredAt: new Date().toISOString(),
    };

    setSessionAnswers((currentAnswers) => [...currentAnswers, storedAnswer]);

    setIsAnswerChecked(true);
  };

  const handleNextQuestion = () => {
    const isLastQuestion = currentQuestionIndex === sessionQuestions.length - 1;

    if (isLastQuestion) {
      const finalAnswers = [...sessionAnswers];

      const finalCorrectAnswers = finalAnswers.filter(
        (answer) => answer.correct,
      ).length;

      setCompletedAnswers(finalAnswers);

      if (subjectId && sessionQuestions.length > 0) {
        savePracticeSession({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          subjectId,
          startedAt: sessionStartedAt || new Date().toISOString(),
          completedAt: new Date().toISOString(),
          totalQuestions: sessionQuestions.length,
          correctAnswers: finalCorrectAnswers,
          answers: finalAnswers,
        });

        setStatisticsVersion((currentVersion) => currentVersion + 1);
      }

      if (subjectId) {
        clearActivePracticeSession(subjectId);
        setActiveSession(null);
      }

      setCorrectAnswers(finalCorrectAnswers);
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
    setCompletedAnswers([]);
    setSessionStartedAt("");
    setCurrentQuestionIndex(0);
    setSelectedOption("");
    setNumberAnswer("");
    setIsAnswerChecked(false);
    setCorrectAnswers(0);
    setExpandedResultQuestions(new Set());
  };

  const toggleResultQuestion = (questionId: string) => {
    setExpandedResultQuestions((currentExpandedQuestions) => {
      const updatedExpandedQuestions = new Set(currentExpandedQuestions);

      if (updatedExpandedQuestions.has(questionId)) {
        updatedExpandedQuestions.delete(questionId);
      } else {
        updatedExpandedQuestions.add(questionId);
      }

      return updatedExpandedQuestions;
    });
  };

  const handleContinueActiveSession = () => {
    if (!activeSession || !subjectId) {
      return;
    }

    const restoredQuestions = activeSession.questionIds
      .map((questionId) =>
        practiceQuestions.find(
          (question) =>
            question.id === questionId && question.subjectId === subjectId,
        ),
      )
      .filter(
        (question): question is PracticeQuestion => question !== undefined,
      );

    if (restoredQuestions.length === 0) {
      clearActivePracticeSession(subjectId);
      setActiveSession(null);
      return;
    }

    const safeQuestionIndex = Math.min(
      activeSession.currentQuestionIndex,
      restoredQuestions.length - 1,
    );

    setSessionQuestions(restoredQuestions);
    setCurrentQuestionIndex(safeQuestionIndex);
    setSelectedOption(activeSession.selectedOption);
    setNumberAnswer(activeSession.numberAnswer);
    setIsAnswerChecked(activeSession.isAnswerChecked);
    setCorrectAnswers(activeSession.correctAnswers);
    setSessionAnswers(activeSession.answers);
    setCompletedAnswers([]);
    setSessionStartedAt(activeSession.startedAt);
    setPracticeMode(activeSession.mode);
    setExpandedResultQuestions(new Set());
    setStage("session");
  };

  const handleDeleteActiveSession = () => {
    if (!subjectId) {
      return;
    }

    const shouldDelete = window.confirm(
      "Vil du slette den påbegynte økten? Svarene i denne økten vil ikke bli lagret i statistikken.",
    );

    if (!shouldDelete) {
      return;
    }

    clearActivePracticeSession(subjectId);
    setActiveSession(null);
  };

  const handleResetTopic = () => {
    if (!subjectId || !resetTopic) {
      return;
    }

    const shouldReset = window.confirm(
      `Vil du nullstille all statistikk for temaet «${resetTopic}»?`,
    );

    if (!shouldReset) {
      return;
    }

    clearPracticeSessionsForTopic(subjectId, resetTopic);

    setStatisticsVersion((currentVersion) => currentVersion + 1);
  };

  const handleResetSubject = () => {
    if (!subjectId) {
      return;
    }

    const shouldReset = window.confirm(
      "Vil du nullstille all oppgavestatistikk og den påbegynte økten for dette faget?",
    );

    if (!shouldReset) {
      return;
    }

    clearPracticeSessionsForSubject(subjectId);
    clearActivePracticeSession(subjectId);

    setActiveSession(null);

    setStatisticsVersion((currentVersion) => currentVersion + 1);
  };

  const handleResetEverything = () => {
    const shouldReset = window.confirm(
      "Vil du slette all oppgavehistorikk og alle påbegynte økter i alle fag? Dette kan ikke angres.",
    );

    if (!shouldReset) {
      return;
    }

    clearPracticeSessions();
    clearAllActivePracticeSessions();

    setActiveSession(null);

    setStatisticsVersion((currentVersion) => currentVersion + 1);
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

    const topicResults = sessionQuestions.reduce<
      Record<
        string,
        {
          total: number;
          correct: number;
        }
      >
    >((results, question) => {
      const storedAnswer = completedAnswers.find(
        (answer) => answer.questionId === question.id,
      );

      if (!results[question.topic]) {
        results[question.topic] = {
          total: 0,
          correct: 0,
        };
      }

      results[question.topic].total += 1;

      if (storedAnswer?.correct) {
        results[question.topic].correct += 1;
      }

      return results;
    }, {});

    const sortedTopicResults = Object.entries(topicResults).sort(
      ([topicA], [topicB]) => topicA.localeCompare(topicB, "nb"),
    );

    const resultTitle =
      percentage === 100
        ? "Perfekt resultat!"
        : percentage >= 80
          ? "Veldig bra jobbet!"
          : percentage >= 60
            ? "Bra jobbet!"
            : "God øving!";

    const resultMessage =
      percentage === 100
        ? "Du svarte riktig på alle oppgavene."
        : percentage >= 80
          ? "Du har svært god kontroll på dette stoffet."
          : percentage >= 60
            ? "Du er på god vei. Se gjennom oppgavene du bommet på."
            : "Se gjennom forklaringene under og prøv gjerne en ny økt.";

    return (
      <main className="practice-page">
        <Link to={`/fag/${subjectId}`} className="back-link">
          ← Tilbake til faget
        </Link>

        <section className="result-section">
          <div className="result-heading">
            <p className="page-label">Resultat</p>

            <h1>{resultTitle}</h1>

            <p>{resultMessage}</p>
          </div>

          <div className="result-summary-grid">
            <div className="result-summary-card">
              <span>Riktige svar</span>

              <strong>
                {correctAnswers} av {sessionQuestions.length}
              </strong>
            </div>

            <div className="result-summary-card">
              <span>Treffprosent</span>
              <strong>{percentage}%</strong>
            </div>

            <div className="result-summary-card">
              <span>Feil svar</span>

              <strong>{sessionQuestions.length - correctAnswers}</strong>
            </div>
          </div>
          <div className="result-topic-section">
            <div className="result-topic-heading">
              <div>
                <p className="page-label">Temaresultater</p>
                <h2>Resultat per tema</h2>
              </div>

              <span>{sortedTopicResults.length} temaer</span>
            </div>

            <div className="result-topic-list">
              {sortedTopicResults.map(([topic, topicResult]) => {
                const topicPercentage = Math.round(
                  (topicResult.correct / topicResult.total) * 100,
                );

                return (
                  <div key={topic} className="result-topic-card">
                    <div className="result-topic-card-header">
                      <div>
                        <strong>{topic}</strong>

                        <span>
                          {topicResult.correct} av {topicResult.total} riktige
                        </span>
                      </div>

                      <strong>{topicPercentage}%</strong>
                    </div>

                    <div className="result-topic-progress">
                      <div
                        className="result-topic-progress-fill"
                        style={{
                          width: `${topicPercentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="result-review">
            <div className="result-review-heading">
              <div>
                <p className="page-label">Gjennomgang</p>

                <h2>Se gjennom oppgavene</h2>
              </div>

              <div className="result-review-actions">
                <span>{sessionQuestions.length} oppgaver</span>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setExpandedResultQuestions(
                      new Set(sessionQuestions.map((question) => question.id)),
                    )
                  }
                >
                  Åpne alle
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setExpandedResultQuestions(new Set())}
                >
                  Lukk alle
                </button>
              </div>
            </div>

            <div className="result-question-list">
              {sessionQuestions.map((question, index) => {
                const storedAnswer = completedAnswers.find(
                  (answer) => answer.questionId === question.id,
                );

                const answerWasCorrect = storedAnswer?.correct ?? false;

                const isExpanded = expandedResultQuestions.has(question.id);

                return (
                  <article
                    key={question.id}
                    className={`result-question-card ${
                      answerWasCorrect
                        ? "result-question-correct"
                        : "result-question-wrong"
                    } ${isExpanded ? "result-question-expanded" : ""}`}
                  >
                    <button
                      type="button"
                      className="result-question-toggle"
                      aria-expanded={isExpanded}
                      onClick={() => toggleResultQuestion(question.id)}
                    >
                      <div className="result-question-header">
                        <div>
                          {answerWasCorrect ? (
                            <CheckCircle2 size={21} />
                          ) : (
                            <XCircle size={21} />
                          )}

                          <strong>Oppgave {index + 1}</strong>
                        </div>

                        <div className="result-question-meta">
                          <span>{question.topic}</span>

                          {isExpanded ? (
                            <ChevronDown size={19} />
                          ) : (
                            <ChevronRight size={19} />
                          )}
                        </div>
                      </div>

                      <h3>
                        <MathText>{question.question}</MathText>
                      </h3>
                    </button>

                    {isExpanded && (
                      <div className="result-question-content">
                        <div className="result-answer-grid">
                          <div
                            className={
                              answerWasCorrect
                                ? "result-user-answer-correct"
                                : "result-user-answer-wrong"
                            }
                          >
                            <span>Ditt svar</span>

                            <strong>
                              <MathText>
                                {storedAnswer?.userAnswer || "Ikke besvart"}
                              </MathText>
                            </strong>
                          </div>

                          <div className="result-correct-answer">
                            <span>Riktig svar</span>

                            <strong>
                              <MathText>
                                {String(question.correctAnswer)}
                              </MathText>
                            </strong>
                          </div>
                        </div>

                        <div className="result-explanation">
                          <strong>Forklaring</strong>

                          <p>
                            <MathText>{question.explanation}</MathText>
                          </p>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className="start-practice-button result-restart-button"
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

      {activeSession && (
        <section className="active-session-card">
          <div className="active-session-information">
            <div className="active-session-icon">
              <History size={22} />
            </div>

            <div>
              <p className="page-label">Påbegynt økt</p>

              <h2>Fortsett der du slapp</h2>

              <p>
                Du har fullført {activeSession.answers.length} av{" "}
                {activeSession.questionIds.length} oppgaver.
              </p>

              <span>
                Sist lagret{" "}
                {new Date(activeSession.updatedAt).toLocaleString("nb-NO", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </span>
            </div>
          </div>

          <div className="active-session-actions">
            <button
              type="button"
              className="start-practice-button active-session-continue"
              onClick={handleContinueActiveSession}
            >
              <Play size={18} />
              Fortsett økten
            </button>

            <button
              type="button"
              className="secondary-button active-session-delete"
              onClick={handleDeleteActiveSession}
            >
              <Trash2 size={17} />
              Slett økten
            </button>
          </div>
        </section>
      )}

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

            {topicGroups.map((group) => (
              <div key={group.title} className="topic-group">
                <div className="topic-group-header">
                  <h3>{group.title}</h3>

                  <span>{group.topics.length} tema</span>
                </div>

                <div className="topics-grid">
                  {group.topics.map((topic) => {
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
              </div>
            ))}
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

          <div className="mistake-practice-card">
            <div className="mistake-practice-heading">
              <div className="mistake-practice-icon">
                <Brain size={20} />
              </div>

              <div>
                <strong>Øv på feil svar</strong>

                <span>
                  {incorrectQuestions.length === 0
                    ? "Ingen oppgaver trenger repetisjon"
                    : `${incorrectQuestions.length} ${
                        incorrectQuestions.length === 1
                          ? "oppgave trenger"
                          : "oppgaver trenger"
                      } repetisjon`}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="secondary-button mistake-practice-button"
              disabled={incorrectQuestions.length === 0}
              onClick={handleStartMistakePractice}
            >
              Start feiløving
              <ChevronRight size={17} />
            </button>
          </div>

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

          <details className="practice-data-management">
            <summary>
              <span>Administrer statistikk</span>
              <ChevronDown size={17} />
            </summary>

            <div className="practice-data-management-content">
              <div className="practice-reset-topic">
                <label htmlFor="reset-practice-topic">Nullstill ett tema</label>

                <select
                  id="reset-practice-topic"
                  value={resetTopic}
                  onChange={(event) => setResetTopic(event.target.value)}
                >
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="secondary-button reset-data-button"
                  disabled={!resetTopic}
                  onClick={handleResetTopic}
                >
                  Nullstill valgt tema
                </button>
              </div>

              <button
                type="button"
                className="secondary-button reset-data-button"
                onClick={handleResetSubject}
              >
                Nullstill hele faget
              </button>

              <button
                type="button"
                className="secondary-button reset-data-button reset-all-data-button"
                onClick={handleResetEverything}
              >
                <Trash2 size={16} />
                Slett all oppgavehistorikk
              </button>
            </div>
          </details>

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
      <section className="topic-progress-section">
        <div className="topic-progress-heading">
          <div>
            <p className="page-label">Fremgang</p>

            <h2>Hvordan du ligger an i temaene</h2>

            <p>Oversikten er basert på alle lagrede øvingsøkter.</p>
          </div>

          <span>
            {topicStatistics.filter((topic) => topic.totalQuestions > 0).length}{" "}
            av {topicStatistics.length} temaer øvd på
          </span>
        </div>

        <div className="topic-progress-grid">
          {topicStatistics.map((topicStatistic) => (
            <article key={topicStatistic.topic} className="topic-progress-card">
              <div className="topic-progress-card-header">
                <div>
                  <strong>{topicStatistic.topic}</strong>

                  <span>
                    {topicStatistic.totalQuestions === 0
                      ? "Ingen svar ennå"
                      : `${topicStatistic.correctAnswers} av ${topicStatistic.totalQuestions} riktige`}
                  </span>
                </div>

                <strong>
                  {topicStatistic.totalQuestions === 0
                    ? "–"
                    : `${topicStatistic.accuracy}%`}
                </strong>
              </div>

              <div className="topic-progress-bar">
                <div
                  className="topic-progress-bar-fill"
                  style={{
                    width: `${topicStatistic.accuracy}%`,
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};
