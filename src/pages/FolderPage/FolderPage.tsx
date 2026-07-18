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

import { NoteCard } from "../../components/NoteCard/NoteCard";

export const FolderPage = () => {
  const { subjectId, folderId } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useContext(AuthContext);

  const [folder, setFolder] = useState<NoteFolder | null>(null);
  const [notes, setNotes] = useState<DatabaseNote[]>([]);

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

        setFolder(loadedFolder);
        setNotes(loadedNotes);
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

  const handleCreateNote = async () => {
    if (!subjectId || !folderId) {
      return;
    }

    const title = window.prompt("Hva skal notatet hete?");

    const trimmedTitle = title?.trim();

    if (!trimmedTitle) {
      return;
    }

    const slug = createSlug(trimmedTitle);

    if (!slug) {
      setError("Notatet må ha en gyldig tittel.");
      return;
    }

    setIsCreatingNote(true);
    setError("");

    try {
      const newNote = await createNote({
        subjectId,
        folderId,
        slug,
        title: trimmedTitle,
        description: "",
        content: "",
        contentJson: null,
      });

      setNotes((currentNotes) => [...currentNotes, newNote]);

      navigate(`/fag/${subjectId}/notater/${newNote.slug}`);
    } catch (error) {
      console.error("Kunne ikke opprette notat:", error);

      setError(
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
        </div>

        {isAdmin && (
          <button
            type="button"
            className="new-folder-button"
            onClick={handleCreateNote}
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
                if (
                  change.type === "moved" ||
                  change.type === "deleted"
                ) {
                  setNotes((currentNotes) =>
                    currentNotes.filter(
                      (currentNote) =>
                        currentNote.id !== note.id,
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
    </main>
  );
};