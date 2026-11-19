import "./RatingStars.css";

// One star shape for the whole app. Drawn as SVG so it looks the same in every font.
const STAR_PATH =
  "M12 2.8l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.7l-5.8 3.0 1.1-6.5-4.7-4.6 6.5-.9z";

export const StarIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d={STAR_PATH} />
  </svg>
);

type RatingStarsProps = {
  value: number;
  // How many stars to draw. Defaults to `value`, so only filled stars are shown.
  total?: number;
  className?: string;
};

export const RatingStars = ({ value, total, className = "" }: RatingStarsProps) => {
  const shownStars = total ?? value;
  const colourClass = `rating-stars-${Math.min(5, Math.max(0, Math.round(value)))}`;

  return (
    <span
      className={`rating-stars ${colourClass} ${className}`.trim()}
      role="img"
      aria-label={`${value} av 5 stjerner`}
    >
      {Array.from({ length: shownStars }, (_, index) => (
        <span
          key={index}
          className={index < value ? "rating-star rating-star-filled" : "rating-star"}
        >
          <StarIcon />
        </span>
      ))}
    </span>
  );
};
