import { sortNotes } from "../../../services/notes/noteOrder";
import { SortableNotes } from "../../../components/notes/SortableNotes/SortableNotes";
import "./FolderPage.css";
import "../NotesPage/NotesPage.css";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FolderPlus, Plus } from "lucide-react";

import { AuthContext } from "../../../context/AuthContext/AuthContext";

import {
  createNoteFolder,
  getNoteFoldersBySubject,
  type NoteFolder,
} from "../../../services/notes/noteFoldersService";

import {
  getChildFolders,
  getFolderAncestors,
} from "../../../services/notes/folderTree";

import {
  createNote,
  getNoteCountsByFolder,
  getNoteMetadataByFolder,
  type NoteMetadata,
} from "../../../services/notes/notesService";

import {
  getSubtopicsByTopic,
  type DatabaseSubtopic,
} from "../../../services/subjects/subjectStructureService";

import { getAllProgress, type Progress } from "../../../services/progress/progressService";

import { FolderNoteCard } from "../../../components/notes/FolderNoteCard/FolderNoteCard";
import { FolderCard } from "../../../components/notes/FolderCard/FolderCard";
import { FolderNameModal } from "../../../components/notes/FolderCard/FolderNameModal";
import { FolderBreadcrumbs } from "../../../components/notes/FolderBreadcrumbs/FolderBreadcrumbs";

export const FolderPage = () => {
  const { subjectId, folderId } = useParams();
  const navigate = useNavigate();

  const { user, isAdmin } = useContext(AuthContext);

  const userId = user?.id;

  // One request loads every folder of the subject. Breadcrumbs, subfolders and move
  // targets are derived from it, so navigating the tree does not query again.
  const [allFolders, setAllFolders] = useState<NoteFolder[]>([]);

  const [folderNoteCounts, setFolderNoteCounts] = useState<Record<string, number>>({});

  const [notes, setNotes] = useState<NoteMetadata[]>([]);

  const [progressByNoteId, setProgressByNoteId] = useState<
    Record<string, Progress>
  >({});

  const [subtopics, setSubtopics] = useState<DatabaseSubtopic[]>([]);

  const [isCreateNoteModalOpen, setIsCreateNoteModalOpen] = useState(false);

  const [isCreateSubfolderModalOpen, setIsCreateSubfolderModalOpen] = useState(false);

  const [newNoteTitle, setNewNoteTitle] = useState("");

  const [selectedSubtopicId, setSelectedSubtopicId] = useState("");

  const [noteModalError, setNoteModalError] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [isCreatingNote, setIsCreatingNote] = useState(false);

  const [error, setError] = useState("");

  const folder = useMemo(
    () => allFolders.find((currentFolder) => currentFolder.id === folderId) ?? null,
    [allFolders, folderId],
  );

  const childFolders = useMemo(
    () => (folder ? getChildFolders(allFolders, folder.id) : []),
    [allFolders, folder],
  );

  const ancestors = useMemo(
    () => (folder ? getFolderAncestors(allFolders, folder.id) : []),
    [allFolders, folder],
  );

  const sortedNotes = sortNotes(notes);

  // A change inside this page refreshes the contents silently, without the loading state.
  const silentReload = useRef(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const silent = silentReload.current;
    silentReload.current = false;

    const loadData = async () => {
      if (!subjectId || !folderId) {
        setError("Mangler informasjon om faget eller mappen.");
        setIsLoading(false);
        return;
      }

      if (!silent) {
        setIsLoading(true);
        setError("");
      }

      try {
        const [loadedFolders, loadedNotes, loadedCounts] = await Promise.all([
          getNoteFoldersBySubject(subjectId),
          getNoteMetadataByFolder(subjectId, folderId),
          getNoteCountsByFolder(subjectId),
        ]);

        const loadedFolder = loadedFolders.find(
          (currentFolder) => currentFolder.id === folderId,
        );

        if (!loadedFolder || loadedFolder.subjectId !== subjectId) {
          setAllFolders([]);
          setError("Fant ikke mappen.");
          return;
        }

        let loadedSubtopics: DatabaseSubtopic[] = [];

        if (loadedFolder.topicId) {
          loadedSubtopics = await getSubtopicsByTopic(loadedFolder.topicId);
        }

        const loadedProgressByNoteId: Record<string, Progress> = {};

        if (userId) {
          const allProgress = await getAllProgress(userId);

          for (const note of loadedNotes) {
            const resourceId = `note-${subjectId}-database-${note.slug}`;

            const noteProgress = allProgress.find(
              (progressItem) =>
                progressItem.itemType === "resource" &&
                progressItem.itemId === resourceId,
            );

            if (noteProgress) {
              loadedProgressByNoteId[note.id] = {
                completed: noteProgress.completed,
                rating: noteProgress.rating,
              };
            }
          }
        }

        setAllFolders(loadedFolders);
        setFolderNoteCounts(loadedCounts);
        setNotes(loadedNotes);
        setSubtopics(loadedSubtopics);
        setProgressByNoteId(loadedProgressByNoteId);
      } catch (error) {
        console.error("Kunne ikke hente mappen:", error);

        setError("Kunne ikke hente mappen.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, [subjectId, folderId, userId, reloadToken]);

  const refreshSilently = () => {
    silentReload.current = true;
    setReloadToken((token) => token + 1);
  };

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
    if (!isAdmin) return;
    if (!subjectId || !folderId) {
      return;
    }

    const trimmedTitle = newNoteTitle.trim();

    if (!trimmedTitle) {
      setNoteModalError("Du må skrive inn en tittel.");
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
        subtopicId: selectedSubtopicId || null,
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

      <FolderBreadcrumbs
        subjectId={subjectId!}
        ancestors={ancestors}
        current={folder}
      />

      <div className="folder-page-header">
        <div>
          <p className="notes-label">Mappe</p>

          <h1>📁 {folder.name}</h1>

          {folder.topicName && (
            <p className="folder-topic-name">Tema: {folder.topicName}</p>
          )}
        </div>

        {isAdmin && (
          <div className="folder-page-actions">
            <button
              type="button"
              className="new-folder-button"
              onClick={() => setIsCreateSubfolderModalOpen(true)}
              disabled={isCreatingNote}
            >
              <FolderPlus size={20} />

              Ny undermappe
            </button>

            <button
              type="button"
              className="new-folder-button"
              onClick={openCreateNoteModal}
              disabled={isCreatingNote}
            >
              <Plus size={20} />

              {isCreatingNote ? "Oppretter..." : "Nytt notat"}
            </button>
          </div>
        )}
      </div>

      {error && <p>{error}</p>}

      {childFolders.length > 0 && (
        <section className="folder-subfolders" aria-label="Undermapper">
          <div className="notes-folders">
            {childFolders.map((childFolder) => (
              <FolderCard
                key={childFolder.id}
                folder={childFolder}
                subjectId={subjectId!}
                noteCount={folderNoteCounts[childFolder.id] ?? 0}
                allFolders={allFolders}
                onFolderCreated={(createdFolder) => {
                  setAllFolders((currentFolders) => [...currentFolders, createdFolder]);
                }}
                onFolderUpdated={(updatedFolder) => {
                  setAllFolders((currentFolders) =>
                    currentFolders.map((currentFolder) =>
                      currentFolder.id === updatedFolder.id
                        ? updatedFolder
                        : currentFolder,
                    ),
                  );
                }}
                onFolderDeleted={() => {
                  // Deleted folders move their notes and subfolders here, so reload the contents.
                  refreshSilently();
                }}
              />
            ))}
          </div>
        </section>
      )}

      {notes.length === 0 ? (
        childFolders.length === 0 ? (
          <p>Denne mappen er tom.</p>
        ) : (
          <p>Ingen notater direkte i denne mappen.</p>
        )
      ) : (
        <SortableNotes key={`${subjectId}:${folderId}`} subjectId={subjectId!} folderId={folderId!}
          notes={sortedNotes} className="folder-notes-grid" enabled={isAdmin && !isCreatingNote} onReordered={setNotes}>
          {(note) => (
            <FolderNoteCard
              key={note.id}
              note={note}
              subjectId={subjectId!}
              progress={
                progressByNoteId[note.id] ?? {
                  completed: false,
                  rating: 0,
                }
              }
              onNoteChanged={(change) => {
                if (change.type === "moved" || change.type === "deleted") {
                  setNotes((currentNotes) =>
                    currentNotes.filter(
                      (currentNote) => currentNote.id !== note.id,
                    ),
                  );

                  setProgressByNoteId((currentProgress) => {
                    const updatedProgress = {
                      ...currentProgress,
                    };

                    delete updatedProgress[note.id];

                    return updatedProgress;
                  });

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
          )}
        </SortableNotes>
      )}

      {isAdmin && isCreateSubfolderModalOpen && (
        <FolderNameModal
          idPrefix={`create-subfolder-page-${folder.id}`}
          label="Ny undermappe"
          title={`Opprett i ${folder.name}`}
          fieldLabel="Mappenavn"
          initialName=""
          submitLabel="Opprett undermappe"
          savingLabel="Oppretter..."
          errorMessage="Kunne ikke opprette undermappen. Prøv igjen."
          onSave={async (name) => {
            const createdFolder = await createNoteFolder(subjectId!, name, null, folder.id);

            setAllFolders((currentFolders) => [...currentFolders, createdFolder]);
            setIsCreateSubfolderModalOpen(false);
          }}
          onClose={() => setIsCreateSubfolderModalOpen(false)}
        />
      )}

      {isAdmin && isCreateNoteModalOpen && (
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
                disabled={isCreatingNote || !folder.topicId}
              >
                <option value="">Ingen undertema</option>

                {subtopics.map((subtopic) => (
                  <option key={subtopic.id} value={subtopic.id}>
                    {subtopic.name}
                  </option>
                ))}
              </select>

              {folder.topicId && subtopics.length === 0 && (
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
                  disabled={isCreatingNote}
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
