import "./AdminVideoStructurePage.css";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type SyntheticEvent,
} from "react";
import { subjects } from "../../data/subjects";
import {
  createVideoSubtopic,
  createVideoTopic,
  deleteVideoSubtopic,
  deleteVideoTopic,
  getAllVideoSubtopicsBySubject,
  getVideoTopicsBySubject,
  updateVideoSubtopic,
  updateVideoTopic,
  type DatabaseVideoSubtopic,
  type DatabaseVideoTopic,
} from "../../services/videosService";

type StructureFormMode = "create" | "edit";

export const AdminVideoStructurePage = () => {
  const [subjectId, setSubjectId] = useState("");

  const [topics, setTopics] = useState<DatabaseVideoTopic[]>([]);

  const [subtopics, setSubtopics] = useState<DatabaseVideoSubtopic[]>([]);

  const [selectedTopicId, setSelectedTopicId] = useState("");

  const [topicFormOpen, setTopicFormOpen] = useState(false);

  const [topicFormMode, setTopicFormMode] =
    useState<StructureFormMode>("create");

  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);

  const [topicName, setTopicName] = useState("");
  const [topicSortOrder, setTopicSortOrder] = useState("1");

  const [subtopicFormOpen, setSubtopicFormOpen] = useState(false);

  const [subtopicFormMode, setSubtopicFormMode] =
    useState<StructureFormMode>("create");

  const [editingSubtopicId, setEditingSubtopicId] = useState<string | null>(
    null,
  );

  const [subtopicTopicId, setSubtopicTopicId] = useState("");

  const [subtopicName, setSubtopicName] = useState("");

  const [subtopicSortOrder, setSubtopicSortOrder] = useState("1");

  const [isLoading, setIsLoading] = useState(false);
  const [isSavingTopic, setIsSavingTopic] = useState(false);

  const [isSavingSubtopic, setIsSavingSubtopic] = useState(false);

  const [deletingTopicId, setDeletingTopicId] = useState<string | null>(null);

  const [deletingSubtopicId, setDeletingSubtopicId] = useState<string | null>(
    null,
  );

  const [errorMessage, setErrorMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const selectedTopic = useMemo(
    () => topics.find((topic) => topic.id === selectedTopicId) ?? null,
    [selectedTopicId, topics],
  );

  const sortedTopics = useMemo(
    () =>
      [...topics].sort((firstTopic, secondTopic) => {
        const orderComparison = firstTopic.sortOrder - secondTopic.sortOrder;

        if (orderComparison !== 0) {
          return orderComparison;
        }

        return firstTopic.name.localeCompare(secondTopic.name, "nb");
      }),
    [topics],
  );

  const getSubtopicsForTopic = (currentTopicId: string) => {
    return subtopics
      .filter((subtopic) => subtopic.topicId === currentTopicId)
      .sort((firstSubtopic, secondSubtopic) => {
        const orderComparison =
          firstSubtopic.sortOrder - secondSubtopic.sortOrder;

        if (orderComparison !== 0) {
          return orderComparison;
        }

        return firstSubtopic.name.localeCompare(secondSubtopic.name, "nb");
      });
  };

  const resetTopicForm = () => {
    setTopicFormOpen(false);
    setTopicFormMode("create");
    setEditingTopicId(null);
    setTopicName("");
    setTopicSortOrder("1");
  };

  const resetSubtopicForm = () => {
    setSubtopicFormOpen(false);
    setSubtopicFormMode("create");
    setEditingSubtopicId(null);
    setSubtopicTopicId("");
    setSubtopicName("");
    setSubtopicSortOrder("1");
  };

  const loadStructure = useCallback(async (currentSubjectId: string) => {
    if (!currentSubjectId) {
      setTopics([]);
      setSubtopics([]);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const [loadedTopics, loadedSubtopics] = await Promise.all([
        getVideoTopicsBySubject(currentSubjectId),
        getAllVideoSubtopicsBySubject(currentSubjectId),
      ]);

      setTopics(loadedTopics);
      setSubtopics(loadedSubtopics);

      setSelectedTopicId((currentSelectedTopicId) => {
        const selectedTopicStillExists = loadedTopics.some(
          (topic) => topic.id === currentSelectedTopicId,
        );

        if (selectedTopicStillExists) {
          return currentSelectedTopicId;
        }

        return loadedTopics[0]?.id ?? "";
      });
    } catch (error) {
      console.error("Kunne ikke hente videostrukturen:", error);

      setTopics([]);
      setSubtopics([]);
      setErrorMessage("Kunne ikke hente temaer og undertemaer.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStructure(subjectId);
  }, [loadStructure, subjectId]);

  const handleSubjectChange = (newSubjectId: string) => {
    setSubjectId(newSubjectId);
    setSelectedTopicId("");

    resetTopicForm();
    resetSubtopicForm();

    setErrorMessage("");
    setSuccessMessage("");
  };

  const openCreateTopicForm = () => {
    if (!subjectId) {
      setErrorMessage("Du må velge et fag før du oppretter et tema.");
      return;
    }

    resetSubtopicForm();

    setTopicFormOpen(true);
    setTopicFormMode("create");
    setEditingTopicId(null);
    setTopicName("");
    setTopicSortOrder(
      String(Math.max(0, ...topics.map((topic) => topic.sortOrder)) + 1),
    );

    setErrorMessage("");
    setSuccessMessage("");
  };

  const openEditTopicForm = (topic: DatabaseVideoTopic) => {
    resetSubtopicForm();

    setTopicFormOpen(true);
    setTopicFormMode("edit");
    setEditingTopicId(topic.id);
    setTopicName(topic.name);
    setTopicSortOrder(String(topic.sortOrder));

    setSelectedTopicId(topic.id);

    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleTopicSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = topicName.trim();
    const parsedSortOrder = Number(topicSortOrder);

    setErrorMessage("");
    setSuccessMessage("");

    if (!subjectId) {
      setErrorMessage("Du må velge et fag.");
      return;
    }

    if (!trimmedName) {
      setErrorMessage("Du må skrive inn et navn på temaet.");
      return;
    }

    if (!Number.isInteger(parsedSortOrder) || parsedSortOrder < 1) {
      setErrorMessage(
        "Tema-rekkefølgen må være et heltall som er 1 eller høyere.",
      );
      return;
    }

    const duplicateTopic = topics.find(
      (topic) =>
        topic.name.localeCompare(trimmedName, "nb", {
          sensitivity: "accent",
        }) === 0 && topic.id !== editingTopicId,
    );

    if (duplicateTopic) {
      setErrorMessage("Det finnes allerede et tema med dette navnet i faget.");
      return;
    }

    setIsSavingTopic(true);

    try {
      if (topicFormMode === "edit" && editingTopicId) {
        await updateVideoTopic(editingTopicId, trimmedName, parsedSortOrder);

        await loadStructure(subjectId);
        resetTopicForm();

        setSuccessMessage("Temaet ble oppdatert.");
        return;
      }

      const createdTopic = await createVideoTopic(
        subjectId,
        trimmedName,
        parsedSortOrder,
      );

      await loadStructure(subjectId);

      setSelectedTopicId(createdTopic.id);
      resetTopicForm();

      setSuccessMessage("Temaet ble opprettet.");
    } catch (error) {
      console.error("Kunne ikke lagre tema:", error);

      setErrorMessage(
        topicFormMode === "edit"
          ? "Kunne ikke oppdatere temaet."
          : "Kunne ikke opprette temaet.",
      );
    } finally {
      setIsSavingTopic(false);
    }
  };

  const openCreateSubtopicForm = (topicId?: string) => {
    const targetTopicId = topicId ?? selectedTopicId;

    if (!targetTopicId) {
      setErrorMessage("Du må velge et tema før du oppretter et undertema.");
      return;
    }

    const topicSubtopics = getSubtopicsForTopic(targetTopicId);

    resetTopicForm();

    setSubtopicFormOpen(true);
    setSubtopicFormMode("create");
    setEditingSubtopicId(null);
    setSubtopicTopicId(targetTopicId);
    setSubtopicName("");

    setSubtopicSortOrder(
      String(
        Math.max(0, ...topicSubtopics.map((subtopic) => subtopic.sortOrder)) +
          1,
      ),
    );

    setSelectedTopicId(targetTopicId);

    setErrorMessage("");
    setSuccessMessage("");
  };

  const openEditSubtopicForm = (subtopic: DatabaseVideoSubtopic) => {
    resetTopicForm();

    setSubtopicFormOpen(true);
    setSubtopicFormMode("edit");
    setEditingSubtopicId(subtopic.id);
    setSubtopicTopicId(subtopic.topicId);
    setSubtopicName(subtopic.name);
    setSubtopicSortOrder(String(subtopic.sortOrder));

    setSelectedTopicId(subtopic.topicId);

    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubtopicSubmit = async (
    event: SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedName = subtopicName.trim();
    const parsedSortOrder = Number(subtopicSortOrder);

    setErrorMessage("");
    setSuccessMessage("");

    if (!subtopicTopicId) {
      setErrorMessage("Du må velge hvilket tema undertemaet skal ligge under.");
      return;
    }

    if (!trimmedName) {
      setErrorMessage("Du må skrive inn et navn på undertemaet.");
      return;
    }

    if (!Number.isInteger(parsedSortOrder) || parsedSortOrder < 1) {
      setErrorMessage(
        "Undertema-rekkefølgen må være et heltall som er 1 eller høyere.",
      );
      return;
    }

    const duplicateSubtopic = subtopics.find(
      (subtopic) =>
        subtopic.topicId === subtopicTopicId &&
        subtopic.name.localeCompare(trimmedName, "nb", {
          sensitivity: "accent",
        }) === 0 &&
        subtopic.id !== editingSubtopicId,
    );

    if (duplicateSubtopic) {
      setErrorMessage(
        "Det finnes allerede et undertema med dette navnet under temaet.",
      );
      return;
    }

    setIsSavingSubtopic(true);

    try {
      if (subtopicFormMode === "edit" && editingSubtopicId) {
        await updateVideoSubtopic(
          editingSubtopicId,
          trimmedName,
          parsedSortOrder,
        );

        await loadStructure(subjectId);
        resetSubtopicForm();

        setSuccessMessage("Undertemaet ble oppdatert.");
        return;
      }

      await createVideoSubtopic(subtopicTopicId, trimmedName, parsedSortOrder);

      await loadStructure(subjectId);
      resetSubtopicForm();

      setSuccessMessage("Undertemaet ble opprettet.");
    } catch (error) {
      console.error("Kunne ikke lagre undertema:", error);

      setErrorMessage(
        subtopicFormMode === "edit"
          ? "Kunne ikke oppdatere undertemaet."
          : "Kunne ikke opprette undertemaet.",
      );
    } finally {
      setIsSavingSubtopic(false);
    }
  };

  const handleDeleteTopic = async (topic: DatabaseVideoTopic) => {
    const topicSubtopics = getSubtopicsForTopic(topic.id);

    const warning =
      topicSubtopics.length > 0
        ? `Temaet «${topic.name}» har ${topicSubtopics.length} undertema. Hvis du sletter temaet, slettes også alle undertemaene og alle videoene i dem.\n\nEr du helt sikker?`
        : `Er du sikker på at du vil slette temaet «${topic.name}»?`;

    const shouldDelete = window.confirm(warning);

    if (!shouldDelete) {
      return;
    }

    setDeletingTopicId(topic.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteVideoTopic(topic.id);

      if (selectedTopicId === topic.id) {
        setSelectedTopicId("");
      }

      if (editingTopicId === topic.id) {
        resetTopicForm();
      }

      if (subtopicTopicId === topic.id) {
        resetSubtopicForm();
      }

      await loadStructure(subjectId);

      setSuccessMessage("Temaet og innholdet i det ble slettet.");
    } catch (error) {
      console.error("Kunne ikke slette tema:", error);

      setErrorMessage("Kunne ikke slette temaet.");
    } finally {
      setDeletingTopicId(null);
    }
  };

  const handleDeleteSubtopic = async (subtopic: DatabaseVideoSubtopic) => {
    const shouldDelete = window.confirm(
      `Hvis du sletter undertemaet «${subtopic.name}», slettes også alle videoene i undertemaet.\n\nEr du helt sikker?`,
    );

    if (!shouldDelete) {
      return;
    }

    setDeletingSubtopicId(subtopic.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteVideoSubtopic(subtopic.id);

      if (editingSubtopicId === subtopic.id) {
        resetSubtopicForm();
      }

      await loadStructure(subjectId);

      setSuccessMessage("Undertemaet og videoene i det ble slettet.");
    } catch (error) {
      console.error("Kunne ikke slette undertema:", error);

      setErrorMessage("Kunne ikke slette undertemaet.");
    } finally {
      setDeletingSubtopicId(null);
    }
  };

  return (
    <main className="page-container">
      <p className="page-label">Administrasjon</p>

      <h1>Videostruktur</h1>

      <p className="page-description">
        Administrer overordnede temaer, undertemaer og rekkefølgen de vises i.
      </p>

      <section className="video-structure-subject-card">
        <label htmlFor="structure-subject">Velg fag</label>

        <select
          id="structure-subject"
          value={subjectId}
          onChange={(event) => handleSubjectChange(event.target.value)}
        >
          <option value="">Velg fag</option>

          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.code} – {subject.name}
            </option>
          ))}
        </select>
      </section>

      {errorMessage && (
        <p className="video-structure-message video-structure-error">
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p className="video-structure-message video-structure-success">
          {successMessage}
        </p>
      )}

      {!subjectId ? (
        <section className="video-structure-empty-card">
          Velg et fag for å se og redigere videostrukturen.
        </section>
      ) : isLoading ? (
        <section className="video-structure-empty-card">
          Laster videostruktur...
        </section>
      ) : (
        <div className="video-structure-layout">
          <section className="video-structure-card">
            <div className="video-structure-header">
              <div>
                <p className="video-structure-card-label">Nivå 1</p>

                <h2>Temaer</h2>
              </div>

              <button type="button" onClick={openCreateTopicForm}>
                + Nytt tema
              </button>
            </div>

            {topicFormOpen && (
              <form
                className="video-structure-form"
                onSubmit={handleTopicSubmit}
              >
                <h3>
                  {topicFormMode === "edit"
                    ? "Rediger tema"
                    : "Opprett nytt tema"}
                </h3>

                <label htmlFor="topic-name">Navn</label>

                <input
                  id="topic-name"
                  type="text"
                  value={topicName}
                  onChange={(event) => setTopicName(event.target.value)}
                  placeholder="For eksempel Tallteori"
                  required
                />

                <label htmlFor="topic-order">Tema-rekkefølge</label>

                <input
                  id="topic-order"
                  type="number"
                  min="1"
                  step="1"
                  value={topicSortOrder}
                  onChange={(event) => setTopicSortOrder(event.target.value)}
                  required
                />

                <div className="video-structure-form-actions">
                  <button type="submit" disabled={isSavingTopic}>
                    {isSavingTopic
                      ? "Lagrer..."
                      : topicFormMode === "edit"
                        ? "Lagre endringer"
                        : "Opprett tema"}
                  </button>

                  <button
                    type="button"
                    className="video-structure-cancel-button"
                    onClick={resetTopicForm}
                    disabled={isSavingTopic}
                  >
                    Avbryt
                  </button>
                </div>
              </form>
            )}

            {sortedTopics.length === 0 ? (
              <p className="video-structure-empty-text">
                Dette faget har ingen temaer ennå.
              </p>
            ) : (
              <div className="video-topic-list">
                {sortedTopics.map((topic) => (
                  <article
                    key={topic.id}
                    className={`video-topic-item ${
                      selectedTopicId === topic.id
                        ? "video-topic-item-selected"
                        : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="video-topic-select-button"
                      onClick={() => setSelectedTopicId(topic.id)}
                    >
                      <span className="video-structure-order-number">
                        {topic.sortOrder}
                      </span>

                      <span>
                        <strong>{topic.name}</strong>

                        <small>
                          {getSubtopicsForTopic(topic.id).length} undertema
                        </small>
                      </span>
                    </button>

                    <div className="video-structure-item-actions">
                      <button
                        type="button"
                        onClick={() => openEditTopicForm(topic)}
                      >
                        Rediger
                      </button>

                      <button
                        type="button"
                        className="video-structure-delete-button"
                        disabled={deletingTopicId === topic.id}
                        onClick={() => handleDeleteTopic(topic)}
                      >
                        {deletingTopicId === topic.id ? "Sletter..." : "Slett"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="video-structure-card">
            <div className="video-structure-header">
              <div>
                <p className="video-structure-card-label">Nivå 2</p>

                <h2>Undertemaer</h2>
              </div>

              <button
                type="button"
                onClick={() => openCreateSubtopicForm()}
                disabled={!selectedTopicId}
              >
                + Nytt undertema
              </button>
            </div>

            {!selectedTopic ? (
              <p className="video-structure-empty-text">
                Velg et tema fra listen for å administrere undertemaene.
              </p>
            ) : (
              <>
                <div className="selected-video-topic">
                  <span>Valgt tema</span>

                  <strong>
                    {selectedTopic.sortOrder}. {selectedTopic.name}
                  </strong>
                </div>

                {subtopicFormOpen && (
                  <form
                    className="video-structure-form"
                    onSubmit={handleSubtopicSubmit}
                  >
                    <h3>
                      {subtopicFormMode === "edit"
                        ? "Rediger undertema"
                        : "Opprett nytt undertema"}
                    </h3>

                    <label htmlFor="subtopic-topic">Overordnet tema</label>

                    <select
                      id="subtopic-topic"
                      value={subtopicTopicId}
                      onChange={(event) =>
                        setSubtopicTopicId(event.target.value)
                      }
                      disabled={subtopicFormMode === "edit"}
                      required
                    >
                      <option value="">Velg tema</option>

                      {sortedTopics.map((topic) => (
                        <option key={topic.id} value={topic.id}>
                          {topic.sortOrder}. {topic.name}
                        </option>
                      ))}
                    </select>

                    <label htmlFor="subtopic-name">Navn</label>

                    <input
                      id="subtopic-name"
                      type="text"
                      value={subtopicName}
                      onChange={(event) => setSubtopicName(event.target.value)}
                      placeholder="For eksempel GCD og Euklids algoritme"
                      required
                    />

                    <label htmlFor="subtopic-order">Undertema-rekkefølge</label>

                    <input
                      id="subtopic-order"
                      type="number"
                      min="1"
                      step="1"
                      value={subtopicSortOrder}
                      onChange={(event) =>
                        setSubtopicSortOrder(event.target.value)
                      }
                      required
                    />

                    <div className="video-structure-form-actions">
                      <button type="submit" disabled={isSavingSubtopic}>
                        {isSavingSubtopic
                          ? "Lagrer..."
                          : subtopicFormMode === "edit"
                            ? "Lagre endringer"
                            : "Opprett undertema"}
                      </button>

                      <button
                        type="button"
                        className="video-structure-cancel-button"
                        onClick={resetSubtopicForm}
                        disabled={isSavingSubtopic}
                      >
                        Avbryt
                      </button>
                    </div>
                  </form>
                )}

                {getSubtopicsForTopic(selectedTopic.id).length === 0 ? (
                  <p className="video-structure-empty-text">
                    Dette temaet har ingen undertemaer ennå.
                  </p>
                ) : (
                  <div className="video-subtopic-list">
                    {getSubtopicsForTopic(selectedTopic.id).map((subtopic) => (
                      <article
                        key={subtopic.id}
                        className="video-subtopic-item"
                      >
                        <div className="video-structure-item-information">
                          <span className="video-structure-order-number">
                            {subtopic.sortOrder}
                          </span>

                          <strong>{subtopic.name}</strong>
                        </div>

                        <div className="video-structure-item-actions">
                          <button
                            type="button"
                            onClick={() => openEditSubtopicForm(subtopic)}
                          >
                            Rediger
                          </button>

                          <button
                            type="button"
                            className="video-structure-delete-button"
                            disabled={deletingSubtopicId === subtopic.id}
                            onClick={() => handleDeleteSubtopic(subtopic)}
                          >
                            {deletingSubtopicId === subtopic.id
                              ? "Sletter..."
                              : "Slett"}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
};
