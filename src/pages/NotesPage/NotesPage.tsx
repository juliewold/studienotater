import "./NotesPage.css";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, Plus, Sparkles, X } from "lucide-react";

import { subjects } from "../../data/subjects";

import {
  createNote,
  getNotesBySubject,
  type DatabaseNote,
} from "../../services/notesService";

import {
  createNoteFolder,
  getNoteFoldersBySubject,
  updateNoteFolderTopic,
  type NoteFolder,
} from "../../services/noteFoldersService";

import { useFavorites } from "../../hooks/useFavorites";
import { useProgress } from "../../hooks/useProgress";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { FolderCard } from "../../components/FolderCard/FolderCard";
import { NoteCard } from "../../components/NoteCard/NoteCard";
import {
  getAllSubtopicsBySubject,
  getTopicsBySubject,
  type DatabaseTopic,
} from "../../services/subjectStructureService";

const createNoteSlug = (
  subjectId: string,
  title: string,
  subtopicId: string,
) => {
  const normalizedTitle = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${subjectId}-${normalizedTitle}-${subtopicId.slice(0, 8)}`;
};

export const NotesPage = () => {
  const { subjectId } = useParams();

  const { isAdmin } = useContext(AuthContext);

  const [notes, setNotes] = useState<DatabaseNote[]>([]);

  const [folderNoteCounts, setFolderNoteCounts] = useState<
    Record<string, number>
  >({});

  const [isLoadingNotes, setIsLoadingNotes] = useState(true);

  const [notesError, setNotesError] = useState("");

  const [folders, setFolders] = useState<NoteFolder[]>([]);

  const [isLoadingFolders, setIsLoadingFolders] = useState(true);

  const [foldersError, setFoldersError] = useState("");

  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

  const [folderName, setFolderName] = useState("");

  const [topicId, setTopicId] = useState("");

  const [topics, setTopics] = useState<DatabaseTopic[]>([]);

  const [folderModalError, setFolderModalError] = useState("");

  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const [isGeneratingStructure, setIsGeneratingStructure] = useState(false);

  const [structureMessage, setStructureMessage] = useState("");

  const folderNameInputRef = useRef<HTMLInputElement | null>(null);

  const subject = subjects.find(
    (currentSubject) => currentSubject.id === subjectId,
  );

  const { isFavorite, toggleFavorite, isLoadingFavorites } = useFavorites();

  const { getProgress, isLoadingProgress } = useProgress();

  const normalizeName = (value: string) => value.trim().toLocaleLowerCase("nb");

  const sortedFolders = useMemo(() => {
    const getTopicForFolder = (folder: NoteFolder) => {
      if (folder.topicId) {
        const topicById = topics.find((topic) => topic.id === folder.topicId);

        if (topicById) {
          return topicById;
        }
      }

      return topics.find(
        (topic) => normalizeName(topic.name) === normalizeName(folder.name),
      );
    };

    return [...folders].sort((folderA, folderB) => {
      const topicA = getTopicForFolder(folderA);
      const topicB = getTopicForFolder(folderB);

      if (topicA && topicB) {
        if (topicA.sortOrder !== topicB.sortOrder) {
          return topicA.sortOrder - topicB.sortOrder;
        }

        return topicA.name.localeCompare(topicB.name, "nb");
      }

      if (topicA && !topicB) {
        return -1;
      }

      if (!topicA && topicB) {
        return 1;
      }

      return folderA.name.localeCompare(folderB.name, "nb");
    });
  }, [folders, topics]);

  useEffect(() => {
    const loadNotes = async () => {
      if (!subjectId) {
        setNotes([]);
        setFolderNoteCounts({});
        setIsLoadingNotes(false);
        return;
      }

      setIsLoadingNotes(true);
      setNotesError("");

      try {
        const allNotes = await getNotesBySubject(subjectId);

        const notesWithoutFolder = allNotes.filter(
          (note) => note.folderId === null,
        );

        const counts = allNotes.reduce<Record<string, number>>(
          (currentCounts, note) => {
            if (!note.folderId) {
              return currentCounts;
            }

            currentCounts[note.folderId] =
              (currentCounts[note.folderId] ?? 0) + 1;

            return currentCounts;
          },
          {},
        );

        setNotes(notesWithoutFolder);
        setFolderNoteCounts(counts);
      } catch (error) {
        console.error("Kunne ikke hente notater:", error);

        setNotesError("Kunne ikke hente notatene.");
      } finally {
        setIsLoadingNotes(false);
      }
    };

    loadNotes();
  }, [subjectId]);

  useEffect(() => {
    const loadFolders = async () => {
      if (!subjectId) {
        setFolders([]);
        setIsLoadingFolders(false);
        return;
      }

      setIsLoadingFolders(true);
      setFoldersError("");

      try {
        const loadedFolders = await getNoteFoldersBySubject(subjectId);

        setFolders(loadedFolders);
      } catch (error) {
        console.error("Kunne ikke hente mapper:", error);

        setFoldersError("Kunne ikke hente mappene.");
      } finally {
        setIsLoadingFolders(false);
      }
    };

    loadFolders();
  }, [subjectId]);

  useEffect(() => {
    const loadTopics = async () => {
      if (!subjectId) {
        setTopics([]);
        return;
      }

      try {
        const loadedTopics = await getTopicsBySubject(subjectId);

        setTopics(loadedTopics);
      } catch (error) {
        console.error("Kunne ikke hente temaer:", error);
      }
    };

    loadTopics();
  }, [subjectId]);

  useEffect(() => {
    if (!isFolderModalOpen) {
      return;
    }

    folderNameInputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFolderModalOpen(false);
        setFolderName("");
        setFolderModalError("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFolderModalOpen]);

  const openFolderModal = () => {
    setTopicId("");
    setFolderName("");
    setFolderModalError("");
    setIsFolderModalOpen(true);
  };

  const closeFolderModal = () => {
    if (isCreatingFolder) {
      return;
    }

    setTopicId("");
    setIsFolderModalOpen(false);
    setFolderName("");
    setFolderModalError("");
  };

  const handleCreateFolder = async () => {
    if (!subjectId) {
      return;
    }

    const trimmedFolderName = folderName.trim();

    if (!trimmedFolderName) {
      setFolderModalError("Du må skrive inn et navn på mappen.");
      return;
    }

    setIsCreatingFolder(true);
    setFolderModalError("");
    setFoldersError("");

    try {
      const newFolder = await createNoteFolder(
        subjectId,
        trimmedFolderName,
        topicId || null,
      );

      setFolders((currentFolders) => [...currentFolders, newFolder]);

      setIsFolderModalOpen(false);
      setFolderName("");
    } catch (error) {
      console.error("Kunne ikke opprette mappe:", error);

      setFolderModalError("Kunne ikke opprette mappen.");
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleGenerateStructure = async () => {
    if (!subjectId || isGeneratingStructure) {
      return;
    }

    const shouldGenerate = window.confirm(
      "Vil du opprette manglende mapper og notater fra fagstrukturen? Eksisterende mapper og notater blir ikke slettet eller overskrevet.",
    );

    if (!shouldGenerate) {
      return;
    }

    setIsGeneratingStructure(true);
    setStructureMessage("");
    setFoldersError("");
    setNotesError("");

    try {
      const [loadedTopics, loadedSubtopics, existingFolders, existingNotes] =
        await Promise.all([
          getTopicsBySubject(subjectId),
          getAllSubtopicsBySubject(subjectId),
          getNoteFoldersBySubject(subjectId),
          getNotesBySubject(subjectId),
        ]);

      let createdFolderCount = 0;
      let createdNoteCount = 0;

      const updatedFolders = [...existingFolders];
      const updatedNotes = [...existingNotes];

      for (const topic of loadedTopics) {
        const normalizeName = (value: string) =>
          value.trim().toLocaleLowerCase("nb");

        let folder = updatedFolders.find(
          (currentFolder) => currentFolder.topicId === topic.id,
        );

        if (!folder) {
          folder = updatedFolders.find(
            (currentFolder) =>
              normalizeName(currentFolder.name) === normalizeName(topic.name),
          );

          if (folder && folder.topicId === null) {
            await updateNoteFolderTopic(folder.id, topic.id);

            const linkedFolder: NoteFolder = {
              ...folder,
              topicId: topic.id,
              topicName: topic.name,
            };

            updatedFolders[
              updatedFolders.findIndex(
                (currentFolder) => currentFolder.id === folder?.id,
              )
            ] = linkedFolder;

            folder = linkedFolder;
          }
        }

        if (!folder) {
          folder = await createNoteFolder(subjectId, topic.name, topic.id);

          updatedFolders.push(folder);
          createdFolderCount += 1;
        }

        const topicSubtopics = loadedSubtopics.filter(
          (subtopic) => subtopic.topicId === topic.id,
        );

        for (const subtopic of topicSubtopics) {
          const noteAlreadyExists = updatedNotes.some(
            (note) =>
              note.subtopicId === subtopic.id ||
              (note.folderId === folder.id &&
                note.title.trim().toLowerCase() ===
                  subtopic.name.trim().toLowerCase()),
          );

          if (noteAlreadyExists) {
            continue;
          }

          const newNote = await createNote({
            subjectId,
            folderId: folder.id,
            subtopicId: subtopic.id,
            slug: createNoteSlug(subjectId, subtopic.name, subtopic.id),
            title: subtopic.name,
            description: "",
            content: "",
            contentJson: null,
          });

          updatedNotes.push(newNote);
          createdNoteCount += 1;
        }
      }

      const notesWithoutFolder = updatedNotes.filter(
        (note) => note.folderId === null,
      );

      const counts = updatedNotes.reduce<Record<string, number>>(
        (currentCounts, note) => {
          if (!note.folderId) {
            return currentCounts;
          }

          currentCounts[note.folderId] =
            (currentCounts[note.folderId] ?? 0) + 1;

          return currentCounts;
        },
        {},
      );

      setTopics(loadedTopics);
      setFolders(updatedFolders);
      setNotes(notesWithoutFolder);
      setFolderNoteCounts(counts);

      if (createdFolderCount === 0 && createdNoteCount === 0) {
        setStructureMessage(
          "Fagstrukturen er allerede oppdatert. Ingen nye mapper eller notater ble opprettet.",
        );
      } else {
        setStructureMessage(
          `Fagstrukturen er oppdatert: ${createdFolderCount} ${
            createdFolderCount === 1 ? "mappe" : "mapper"
          } og ${createdNoteCount} ${
            createdNoteCount === 1 ? "notat" : "notater"
          } ble opprettet.`,
        );
      }
    } catch (error) {
      console.error("Kunne ikke generere fagstruktur:", error);

      setStructureMessage("Kunne ikke opprette fagstrukturen.");
    } finally {
      setIsGeneratingStructure(false);
    }
  };

  const handleFolderFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleCreateFolder();
  };

  if (!subject) {
    return (
      <main className="notes-page">
        <h1>Fant ikke faget</h1>
      </main>
    );
  }

  return (
    <main className="notes-page">
      <Link to={`/fag/${subject.id}`} className="back-link">
        ← Tilbake til faget
      </Link>

      <div className="notes-header">
        <div>
          <p className="notes-label">Notater</p>

          <h1>{subject.code}</h1>

          <p>{subject.name}</p>
        </div>

        {isAdmin && (
          <div className="notes-header-actions">
            <button
              type="button"
              className="generate-structure-button"
              onClick={handleGenerateStructure}
              disabled={isGeneratingStructure}
            >
              <Sparkles size={19} />

              {isGeneratingStructure ? "Oppretter..." : "Opprett fagstruktur"}
            </button>

            <button
              type="button"
              className="new-folder-button"
              onClick={openFolderModal}
              disabled={isGeneratingStructure}
            >
              <Plus size={20} />
              Ny mappe
            </button>
          </div>
        )}
      </div>

      {structureMessage && (
        <p className="structure-message">{structureMessage}</p>
      )}

      {foldersError && <p className="notes-error-message">{foldersError}</p>}

      {isLoadingFolders && <p>Laster mapper...</p>}

      {!isLoadingFolders && folders.length > 0 && (
        <div className="notes-folders">
          {sortedFolders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              subjectId={subject.id}
              noteCount={folderNoteCounts[folder.id] ?? 0}
              onFolderUpdated={(updatedFolder) => {
                setFolders((currentFolders) =>
                  currentFolders.map((currentFolder) =>
                    currentFolder.id === updatedFolder.id
                      ? updatedFolder
                      : currentFolder,
                  ),
                );
              }}
              onFolderDeleted={(deletedFolderId) => {
                setFolders((currentFolders) =>
                  currentFolders.filter(
                    (currentFolder) => currentFolder.id !== deletedFolderId,
                  ),
                );
              }}
            />
          ))}
        </div>
      )}

      {(isLoadingProgress || isLoadingNotes) && <p>Laster notater...</p>}

      {notesError && <p className="notes-error-message">{notesError}</p>}

      {!isLoadingNotes &&
        !isLoadingFolders &&
        notes.length === 0 &&
        folders.length === 0 && (
          <p>Ingen mapper eller notater er lagt til ennå.</p>
        )}

      {!isLoadingNotes && notes.length > 0 && (
        <div className="notes-list">
          {notes.map((note) => {
            const favoriteId = `${subject.id}-database-${note.slug}`;

            const resourceId = `note-${subject.id}-database-${note.slug}`;

            const favorite = isFavorite(favoriteId, "note");

            const { completed, rating } = getProgress(resourceId, "resource");

            return (
              <NoteCard
                key={note.id}
                note={note}
                subjectId={subject.id}
                progress={{
                  completed,
                  rating,
                }}
                actions={
                  <button
                    type="button"
                    className={`favorite-button ${
                      favorite ? "is-favorite" : ""
                    }`}
                    aria-label={
                      favorite
                        ? "Fjern fra favoritter"
                        : "Legg til i favoritter"
                    }
                    disabled={isLoadingFavorites}
                    onClick={() =>
                      toggleFavorite({
                        id: favoriteId,
                        title: note.title,
                        subject: subject.name,
                        type: "note",
                        url: `/fag/${subject.id}/notater/${note.slug}`,
                      })
                    }
                  >
                    <Heart
                      size={22}
                      fill={favorite ? "currentColor" : "transparent"}
                      strokeWidth={2}
                    />
                  </button>
                }
                onNoteChanged={(change) => {
                  if (change.type === "moved" || change.type === "deleted") {
                    setNotes((currentNotes) =>
                      currentNotes.filter(
                        (currentNote) => currentNote.id !== note.id,
                      ),
                    );

                    return;
                  }

                  if (change.type === "renamed") {
                    setNotes((currentNotes) =>
                      currentNotes.map((currentNote) =>
                        currentNote.id === note.id
                          ? {
                              ...currentNote,
                              title: change.title,
                            }
                          : currentNote,
                      ),
                    );
                  }
                }}
              />
            );
          })}
        </div>
      )}

      {isFolderModalOpen && (
        <div className="folder-modal-backdrop" onMouseDown={closeFolderModal}>
          <section
            className="folder-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="folder-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="folder-modal-header">
              <div>
                <p className="folder-modal-label">Ny mappe</p>

                <h2 id="folder-modal-title">Opprett mappe</h2>
              </div>

              <button
                type="button"
                className="folder-modal-close-button"
                aria-label="Lukk"
                onClick={closeFolderModal}
                disabled={isCreatingFolder}
              >
                <X size={21} />
              </button>
            </div>

            <form
              className="folder-modal-form"
              onSubmit={handleFolderFormSubmit}
            >
              <label htmlFor="folder-name">Mappenavn</label>

              <input
                ref={folderNameInputRef}
                id="folder-name"
                type="text"
                value={folderName}
                onChange={(event) => {
                  setFolderName(event.target.value);

                  if (folderModalError) {
                    setFolderModalError("");
                  }
                }}
                placeholder="For eksempel Forelesninger"
                disabled={isCreatingFolder}
              />

              <label htmlFor="folder-topic">Tema</label>

              <select
                id="folder-topic"
                value={topicId}
                onChange={(event) => {
                  setTopicId(event.target.value);

                  if (folderModalError) {
                    setFolderModalError("");
                  }
                }}
                disabled={isCreatingFolder}
              >
                <option value="">Ingen tema</option>

                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>

              {folderModalError && (
                <p className="folder-modal-error">{folderModalError}</p>
              )}

              <div className="folder-modal-actions">
                <button
                  type="button"
                  className="folder-modal-cancel-button"
                  onClick={closeFolderModal}
                  disabled={isCreatingFolder}
                >
                  Avbryt
                </button>

                <button
                  type="submit"
                  className="folder-modal-submit-button"
                  disabled={isCreatingFolder}
                >
                  <Plus size={18} />

                  {isCreatingFolder ? "Oppretter..." : "Opprett mappe"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
};
