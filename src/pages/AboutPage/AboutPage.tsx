import "./AboutPage.css";

const features = [
  {
    title: "Notater",
    description: "Finn og organiser notater fra fagene dine.",
    icon: "📚",
  },
  {
    title: "Flashcards",
    description: "Øv aktivt og test hva du husker.",
    icon: "📝",
  },
  {
    title: "Videoer",
    description: "Samle nyttige videoer på ett sted.",
    icon: "🎥",
  },
  {
    title: "PDF-er",
    description: "Få rask tilgang til forelesninger og læreboknotater.",
    icon: "📄",
  },
  {
    title: "Planlegging",
    description: "Planlegg semesteret og hold oversikt over pensum.",
    icon: "📅",
  },
  {
    title: "Progresjon",
    description: "Følg med på hvor langt du har kommet.",
    icon: "📊",
  },
];

export function AboutPage() {
  return (
    <main className="about-page">
      <header className="about-header">
        <span className="about-label">OM NETTSIDEN</span>
        <h1>Alt til studiene samlet på ett sted</h1>
        <p>
          Studienotater gjør det enklere å finne faginnhold, holde oversikt over
          progresjonen og planlegge studiehverdagen.
        </p>
      </header>

      <section className="about-features">
        {features.map((feature) => (
          <article className="about-feature-card" key={feature.title}>
            <div className="about-feature-icon">{feature.icon}</div>

            <div>
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="about-info">
        <div>
          <span className="about-label">MÅLET</span>
          <h2>Mer tid til læring</h2>
        </div>

        <p>
          Målet er å bruke mindre tid på å lete gjennom mapper og ulike
          nettsider, og mer tid på selve læringen.
        </p>
      </section>

      <section className="about-development">
        <h2>Nettsiden er under utvikling</h2>

        <p>
          Studienotater utvikles kontinuerlig, og nye fag, notater og funksjoner
          legges til etter hvert.
        </p>
      </section>
    </main>
  );
}
