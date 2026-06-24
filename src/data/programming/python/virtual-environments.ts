export const pythonVirtualEnvironments = {
  id: "virtual-environments",
  title: "Virtual Environments",

  sections: [
    {
      title: "Hva er et virtual environment?",
      content:
        "Et virtual environment er et isolert Python-miljø for et prosjekt. Det gjør at hvert prosjekt kan ha sine egne pakker og versjoner.",
    },

    {
      title: "Hvorfor bruke det?",
      content:
        "Uten virtual environment kan pakker fra ulike prosjekter blandes. Med virtual environment holder du prosjektene adskilt og ryddige.",
    },

    {
      title: "Lage et virtual environment",
      content:
        "Dette lager en mappe som inneholder et eget Python-miljø for prosjektet.",
      code: `python -m venv venv`,
    },

    {
      title: "Aktivere på Mac/Linux",
      content:
        "På Mac og Linux aktiverer du miljøet med source.",
      code: `source venv/bin/activate`,
    },

    {
      title: "Aktivere på Windows",
      content:
        "På Windows aktiverer du miljøet fra Scripts-mappen.",
      code: `venv\\Scripts\\activate`,
    },

    {
      title: "Installere pakker",
      content:
        "Når miljøet er aktivert, installeres pakker bare i dette prosjektet.",
      code: `pip install django`,
    },

    {
      title: "Lagre pakker i requirements.txt",
      content:
        "requirements.txt brukes til å lagre hvilke pakker prosjektet trenger.",
      code: `pip freeze > requirements.txt`,
    },

    {
      title: "Installere fra requirements.txt",
      content:
        "Dette installerer alle pakkene som står i requirements.txt.",
      code: `pip install -r requirements.txt`,
    },

    {
      title: "Deaktivere miljøet",
      content:
        "Når du er ferdig kan du slå av virtual environment.",
      code: `deactivate`,
    },

    {
      title: "Oppsummering",
      content:
        "Virtual environments brukes for å holde Python-prosjekter isolerte. Vanlig flyt er: lag miljø, aktiver det, installer pakker, lag requirements.txt og deaktiver når du er ferdig.",
    },
  ],
};