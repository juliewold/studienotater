import "./HomeProgress.css";
import { notes } from "../../data/notes";

export const HomeProgress = () => {
  const totalTopics = Object.values(notes).flat().length;

  const completedTopics = Object.keys(localStorage)
    .filter((key) => key.startsWith("syllabus-"))
    .flatMap((key) => JSON.parse(localStorage.getItem(key) || "[]")).length;

  const progress =
    totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);

  return (
    <section className="home-progress">
      <div>
        <p className="home-progress-label">Pensumtracker</p>
        <h2>{completedTopics} / {totalTopics} temaer fullført</h2>
      </div>

      <div className="home-progress-bar">
        <div
          className="home-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="home-progress-percent">{progress}% fullført</p>
    </section>
  );
};