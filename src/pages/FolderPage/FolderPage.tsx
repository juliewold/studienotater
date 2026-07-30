import "./FolderPage.css";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Plus } from "lucide-react";

import { AuthContext } from "../../context/AuthContext/AuthContext";

import {
  getNoteFolderById,
  type NoteFolder,
} from "../../services/noteFoldersService";

import {
  createNote,
  getNotesByFolder,
  type DatabaseNote,
} from "../../services/notesService";

import {
  getSubtopicsByTopic,
  type DatabaseSubtopic,
} from "../../services/subjectStructureService";

import { NoteCard } from "../../components/NoteCard/NoteCard";

export const FolderPage = () => {
  const { subjectId, folderId } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useContext(AuthContext);

  const [folder, setFolder] = useState<NoteFolder | null>(null);

  const [notes, setNotes] = useState<DatabaseNote[]>([]);

  const [subtopics, setSubtopics] = useState<DatabaseSubtopic[]>([]);

  const [isCreateNoteModalOpen, setIsCreateNoteModalOpen] = useState(false);

  const [newNoteTitle, setNewNoteTitle] = useState("");

  const [selectedSubtopicId, setSelectedSubtopicId] = useState("");

  const [noteModalError, setNoteModalError] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [isCreatingNote, setIsCreatingNote] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!subjectId || !folderId) {
        setError("Mangler informasjon om faget eller mappen.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const loadedFolder = await getNoteFolderById(folderId);

        if (!loadedFolder || loadedFolder.subjectId !== subjectId) {
          setError("Fant ikke mappen.");
          return;
        }

        const loadedNotes = await getNotesByFolder(subjectId, folderId);

        let loadedSubtopics: DatabaseSubtopic[] = [];

        if (loadedFolder.topicId) {
          loadedSubtopics = await getSubtopicsByTopic(
            loadedFolder.topicId,
          );
        }

        setFolder(loadedFolder);
        setNotes(loadedNotes);
        setSubtopics(loadedSubtopics);
      } catch (error) {
        console.error("Kunne ikke hente mappen:", error);

        setError("Kunne ikke hente mappen.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [subjectId, folderId]);

  const createSlug = (value: string) => {
    return value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const openCreateNoteModal = () => {
    setNewNoteTitle("");
    setSelectedSubtopicId("");
    setNoteModalError("");
    setIsCreateNoteModalOpen(true);
  };

  const closeCreateNoteModal = () => {
    if (isCreatingNote) {
      return;
    }

    setIsCreateNoteModalOpen(false);
    setNewNoteTitle("");
    setSelectedSubtopicId("");
    setNoteModalError("");
  };

  const handleCreateNote = async () => {
    if (!subjectId || !folderId) {
      return;
    }

    const trimmedTitle = newNoteTitle.trim();

    if (!trimmedTitle) {
      setNoteModalError("Du må skrive inn en tittel.");
      return;
    }

    if (!selectedSubtopicId) {
      setNoteModalError("Du må velge et undertema.");
      return;
    }

    const slug = createSlug(trimmedTitle);

    if (!slug) {
      setNoteModalError("Notatet må ha en gyldig tittel.");
      return;
    }

    setIsCreatingNote(true);
    setNoteModalError("");
    setError("");

    try {
      const newNote = await createNote({
        subjectId,
        folderId,
        subtopicId: selectedSubtopicId,
        slug,
        title: trimmedTitle,
        description: "",
        content: "",
        contentJson: null,
      });

      setNotes((currentNotes) => [...currentNotes, newNote]);

      setIsCreateNoteModalOpen(false);
      setNewNoteTitle("");
      setSelectedSubtopicId("");
      setNoteModalError("");

      navigate(`/fag/${subjectId}/notater/${newNote.slug}`);
    } catch (error) {
      console.error("Kunne ikke opprette notat:", error);

      setNoteModalError(
        "Kunne ikke opprette notatet. Det kan allerede finnes et notat med samme adresse.",
      );
    } finally {
      setIsCreatingNote(false);
    }
  };

  if (isLoading) {
    return (
      <main className="page-container">
        <p>Laster...</p>
      </main>
    );
  }

  if (error && !folder) {
    return (
      <main className="page-container">
        <Link to={`/fag/${subjectId}/notater`} className="back-link">
          ← Tilbake
        </Link>

        <p>{error}</p>
      </main>
    );
  }

  if (!folder) {
    return null;
  }

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}/notater`} className="back-link">
        ← Tilbake til notater
      </Link>

      <div className="folder-page-header">
        <div>
          <p className="notes-label">Mappe</p>

          <h1>📁 {folder.name}</h1>

          {folder.topicName && (
            <p className="folder-topic-name">Tema: {folder.topicName}</p>
          )}
        </div>

        {isAdmin && (
          <button
            type="button"
            className="new-folder-button"
            onClick={openCreateNoteModal}
            disabled={isCreatingNote}
          >
            <Plus size={20} />

            {isCreatingNote ? "Oppretter..." : "Nytt notat"}
          </button>
        )}
      </div>

      {error && <p>{error}</p>}

      {notes.length === 0 ? (
        <p>Denne mappen er tom.</p>
      ) : (
        <div className="notes-list">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              subjectId={subjectId!}
              descriptionFallback="Klikk for å åpne notatet."
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
          ))}
        </div>
      )}

      {isCreateNoteModalOpen && (
        <div
          className="folder-modal-backdrop"
          onMouseDown={closeCreateNoteModal}
        >
          <section
            className="folder-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="folder-modal-header">
              <div>
                <p className="folder-modal-label">Nytt notat</p>

                <h2>Opprett notat</h2>
              </div>
            </div>

            <div className="folder-modal-form">
              <label htmlFor="new-note-title">Notattittel</label>

              <input
                id="new-note-title"
                type="text"
                value={newNoteTitle}
                onChange={(event) => {
                  setNewNoteTitle(event.target.value);

                  if (noteModalError) {
                    setNoteModalError("");
                  }
                }}
                disabled={isCreatingNote}
                autoFocus
              />

              <label htmlFor="new-note-subtopic">Undertema</label>

              <select
                id="new-note-subtopic"
                value={selectedSubtopicId}
                onChange={(event) => {
                  setSelectedSubtopicId(event.target.value);

                  if (noteModalError) {
                    setNoteModalError("");
                  }
                }}
                disabled={isCreatingNote}
              >
                <option value="">Velg undertema</option>

                {subtopics.map((subtopic) => (
                  <option key={subtopic.id} value={subtopic.id}>
                    {subtopic.name}
                  </option>
                ))}
              </select>

              {subtopics.length === 0 && (
                <p className="folder-modal-error">
                  Dette temaet har ingen undertemaer ennå.
                </p>
              )}

              {noteModalError && (
                <p className="folder-modal-error">{noteModalError}</p>
              )}

              <div className="folder-modal-actions">
                <button
                  type="button"
                  className="folder-modal-cancel-button"
                  onClick={closeCreateNoteModal}
                  disabled={isCreatingNote}
                >
                  Avbryt
                </button>

                <button
                  type="button"
                  className="folder-modal-submit-button"
                  onClick={handleCreateNote}
                  disabled={isCreatingNote || subtopics.length === 0}
                >
                  {isCreatingNote ? "Oppretter..." : "Opprett notat"}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};
