import "./StudyPlanPage.css";
import { Link, useParams } from "react-router-dom";
import { studyPlans } from "../../data/studyPlans";

export const StudyPlanPage = () => {
  const { subjectId } = useParams();

  const plan = studyPlans[subjectId as keyof typeof studyPlans] || [];

  const toggleItem = (itemId: string) => {
    const key = `study-plan-${subjectId}-${itemId}`;
    const currentValue = localStorage.getItem(key) === "true";

    localStorage.setItem(key, String(!currentValue));
    window.location.reload();
  };

  const isChecked = (itemId: string) => {
    return localStorage.getItem(`study-plan-${subjectId}-${itemId}`) === "true";
  };

  const getTopicItems = (topic: (typeof plan)[number]) => {
    return [
      ...topic.reading.map((item) => ({
        id: `${topic.id}-reading-${item}`,
        label: item,
        type: "reading",
      })),
      ...topic.lectures.map((item) => ({
        id: `${topic.id}-lecture-${item}`,
        label: item,
        type: "lecture",
      })),
      ...[...topic.exercises, ...topic.assignments, ...topic.stack].map(
        (item) => ({
          id: `${topic.id}-task-${item}`,
          label: item,
          type: "task",
        }),
      ),
    ];
  };

  const allItems = plan.flatMap((topic) => getTopicItems(topic));
  const completedItems = allItems.filter((item) => isChecked(item.id));

  const totalProgress =
    allItems.length === 0
      ? 0
      : Math.round((completedItems.length / allItems.length) * 100);

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}`} className="back-link">
        ← Tilbake til faget
      </Link>

      <p className="page-label">Studieplan</p>
      <h1>Fremdriftsplan</h1>

      <p>
        Kryss av det du har lest, sett eller gjort. Planen er sortert etter
        tema, slik at du kan øve i ditt eget tempo.
      </p>

      <section className="study-plan-summary">
        <div>
          <p className="study-plan-summary-label">Total fremdrift</p>
          <h2>
            {completedItems.length} / {allItems.length} punkter fullført
          </h2>
        </div>

        <p>{totalProgress}%</p>

        <div className="study-plan-progress-bar">
          <div
            className="study-plan-progress-fill"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
      </section>

      <div className="study-plan-list">
        {plan.map((topic) => {
          const topicItems = getTopicItems(topic);
          const completedTopicItems = topicItems.filter((item) =>
            isChecked(item.id),
          );

          const topicProgress =
            topicItems.length === 0
              ? 0
              : Math.round(
                  (completedTopicItems.length / topicItems.length) * 100,
                );

          return (
            <section key={topic.id} className="study-plan-card">
              <div className="study-plan-card-header">
                <div>
                  <h2>{topic.title}</h2>

                  <p>
                    {completedTopicItems.length} / {topicItems.length} punkter
                    fullført
                  </p>
                </div>

                <span>{topicProgress}%</span>
              </div>

              <div className="study-plan-progress-bar">
                <div
                  className="study-plan-progress-fill"
                  style={{ width: `${topicProgress}%` }}
                />
              </div>

              <div className="study-plan-grid">
                <div>
                  <h3>Pensum</h3>
                  {topic.reading.map((item) => (
                    <label key={item} className="study-plan-item">
                      <input
                        type="checkbox"
                        checked={isChecked(`${topic.id}-reading-${item}`)}
                        onChange={() =>
                          toggleItem(`${topic.id}-reading-${item}`)
                        }
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <h3>Forelesninger</h3>
                  {topic.lectures.map((item) => (
                    <label key={item} className="study-plan-item">
                      <input
                        type="checkbox"
                        checked={isChecked(`${topic.id}-lecture-${item}`)}
                        onChange={() =>
                          toggleItem(`${topic.id}-lecture-${item}`)
                        }
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <h3>Oppgaver</h3>
                  {[...topic.exercises, ...topic.assignments, ...topic.stack].map(
                    (item) => (
                      <label key={item} className="study-plan-item">
                        <input
                          type="checkbox"
                          checked={isChecked(`${topic.id}-task-${item}`)}
                          onChange={() => toggleItem(`${topic.id}-task-${item}`)}
                        />
                        <span>{item}</span>
                      </label>
                    ),
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
};