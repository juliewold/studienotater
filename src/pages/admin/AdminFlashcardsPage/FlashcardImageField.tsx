import "./FlashcardImageField.css";

import { useEffect, useMemo, useRef } from "react";

import { usePrivateStorageUrl } from "../../../hooks/usePrivateStorageUrl";

type FlashcardImageFieldProps = {
  id: string;
  label: string;
  /** Path of the image already saved on the card, if any. */
  savedPath: string | null;
  /** Newly chosen file. It is uploaded when the card is saved. */
  pendingFile: File | null;
  onFileChange: (file: File | null) => void;
  onClear: () => void;
};

const acceptedImageTypes = "image/png,image/jpeg,image/webp,image/gif";

export const FlashcardImageField = ({
  id,
  label,
  savedPath,
  pendingFile,
  onFileChange,
  onClear,
}: FlashcardImageFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const savedImage = usePrivateStorageUrl("note-images", pendingFile ? null : savedPath);
  const previewUrl = useMemo(
    () => (pendingFile ? URL.createObjectURL(pendingFile) : null),
    [pendingFile],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const hasImage = Boolean(pendingFile || savedPath);
  const imageUrl = pendingFile ? previewUrl : savedImage.url;

  const clear = () => {
    if (inputRef.current) inputRef.current.value = "";
    onClear();
  };

  return (
    <div className="admin-flashcard-image-field">
      <label htmlFor={id}>{label}</label>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={acceptedImageTypes}
        onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
      />

      {hasImage && (
        <div className="admin-flashcard-image-current">
          {imageUrl ? (
            <img className="admin-flashcard-image-preview" src={imageUrl} alt="" />
          ) : savedImage.error ? (
            <span>Kunne ikke vise bildet.</span>
          ) : (
            <span>Laster bilde …</span>
          )}

          <button type="button" onClick={clear}>
            Fjern bilde
          </button>
        </div>
      )}
    </div>
  );
};
