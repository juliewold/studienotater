import "./LoadingPlaceholder.css";

type LoadingPlaceholderProps = {
  label: string;
  height?: number;
};

// Shown while a page's data loads. It keeps the space of the content it replaces, so the page does not jump.
export const LoadingPlaceholder = ({ label, height = 200 }: LoadingPlaceholderProps) => (
  <div className="loading-placeholder" role="status">
    <span className="loading-placeholder-label">{label}</span>
    <div className="loading-placeholder-block" style={{ height }} aria-hidden="true" />
  </div>
);
