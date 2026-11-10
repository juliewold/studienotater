import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import "./FolderCard.css";

type FolderNameModalProps = {
  idPrefix: string;
  label: string;
  title: string;
  fieldLabel: string;
  initialName: string;
  submitLabel: string;
  savingLabel: string;
  errorMessage: string;
  onSave: (name: string) => Promise<void>;
  onClose: () => void;
};

// Shared name dialog for creating and renaming folders (same look as the existing folder dialogs).
export const FolderNameModal = ({
  idPrefix,
  label,
  title,
  fieldLabel,
  initialName,
  submitLabel,
  savingLabel,
  errorMessage,
  onSave,
  onClose,
}: FolderNameModalProps) => {
  const [name, setName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSaving, onClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Du må skrive inn et mappenavn.");
      return;
    }

    if (trimmedName === initialName.trim()) {
      onClose();
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      await onSave(trimmedName);
    } catch (saveError) {
      console.error(errorMessage, saveError);

      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="folder-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) {
          onClose();
        }
      }}
    >
      <div
        className="folder-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${idPrefix}-title`}
      >
        <div className="folder-modal-header">
          <div>
            <p className="folder-modal-label">{label}</p>

            <h2 id={`${idPrefix}-title`}>{title}</h2>
          </div>

          <button
            type="button"
            className="folder-modal-close"
            aria-label="Lukk"
            disabled={isSaving}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="folder-modal-field" htmlFor={`${idPrefix}-input`}>
            {fieldLabel}
            <input
              id={`${idPrefix}-input`}
              type="text"
              value={name}
              autoFocus
              disabled={isSaving}
              onChange={(event) => {
                setName(event.target.value);

                if (error) {
                  setError("");
                }
              }}
            />
          </label>

          {error && <p className="folder-modal-error">{error}</p>}

          <div className="folder-modal-actions">
            <button
              type="button"
              className="folder-modal-cancel"
              disabled={isSaving}
              onClick={onClose}
            >
              Avbryt
            </button>

            <button
              type="submit"
              className="folder-modal-submit"
              disabled={isSaving}
            >
              {isSaving ? savingLabel : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
