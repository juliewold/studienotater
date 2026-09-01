import "./PdfSummaryModal.css";
import { X } from "lucide-react";

type PdfSummaryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const PdfSummaryModal = ({
  isOpen,
  onClose,
  children,
}: PdfSummaryModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="pdf-summary-modal-backdrop" onClick={onClose}>
      <div
        className="pdf-summary-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Oppsummering"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="pdf-summary-modal-close"
          onClick={onClose}
          aria-label="Lukk oppsummering"
        >
          <X size={22} />
        </button>

        <div className="pdf-summary-modal-content">{children}</div>
      </div>
    </div>
  );
};
