export const pdfs = {
  tma4412: Array.from({ length: 24 }, (_, i) => ({
    id: `forelesning-${i + 1}`,
    title: `Forelesning ${i + 1}`,
    file: `/pdfs/tma4412/Forelesning ${i + 1}.pdf`,
    category: "forelesninger",
  })),

  tma4400: Array.from({ length: 13 }, (_, i) => ({
    id: `forelesning-${i + 1}`,
    title: `Forelesning ${i + 1}`,
    file: `/pdfs/tma4400/forelesninger/Forelesning ${i + 1}.pdf`,
    category: "forelesninger",
  })),

  ttt4203: [
    {
      id: "notater",
      title: "ERT-øktene",
      file: "/pdfs/ttt4203/Notater.pdf",
      category: "forelesninger",
    },
  ],

  tdt4180: [
    {
      id: "notater",
      title: "Notater",
      file: "/pdfs/tdt4180/Notater.pdf",
      category: "forelesninger",
    },
  ],

  tma4422: [
    {
      id: "vektorrom",
      title: "Vektorrom (forelesning 1-4)",
      file: "/pdfs/tma4422/forelesninger/Vektorrom.pdf",
      category: "forelesninger",
    },
    {
      id: "lineaertransformasjon",
      title: "Lineærtransformasjon (forelesning 5-8)",
      file: "/pdfs/tma4422/forelesninger/Lineaertransformasjoner.pdf",
      category: "forelesninger",
    },
    {
      id: "indreproduktrom",
      title: "Indreproduktrom (forelesning 9-12)",
      file: "/pdfs/tma4422/forelesninger/Indreproduktrom.pdf",
      category: "forelesninger",
    },
    {
      id: "differensialligninger",
      title: "Differensialligninger (forelesning 13-18)",
      file: "/pdfs/tma4422/forelesninger/Differensialligninger.pdf",
      category: "forelesninger",
    },
    {
      id: "interpolasjon",
      title: "Interpolasjon (forelesning 19-20)",
      file: "/pdfs/tma4422/forelesninger/Interpolasjon.pdf",
      category: "forelesninger",
    },
    {
      id: "numerisk-integrasjon",
      title: "Numerisk integrasjon (forelesning 21-22)",
      file: "/pdfs/tma4422/forelesninger/Numerisk integrasjon.pdf",
      category: "forelesninger",
    },
    {
      id: "rekker",
      title: "Rekker (forelesning 23-26)",
      file: "/pdfs/tma4422/forelesninger/Rekker.pdf",
      category: "forelesninger",
    },
    {
      id: "oppsummering",
      title: "Oppsummering (forelesning 27-28)",
      file: "/pdfs/tma4422/forelesninger/Oppsummering.pdf",
      category: "forelesninger",
    },
    {
      id: "presentasjonsnotater-differensialligninger",
      title: "Presentasjonsnotater differensialligninger",
      file: "/pdfs/tma4422/presentasjoner/Presentasjonsnotater differensialligninger.pdf",
      category: "presentasjoner",
    },
    {
      id: "presentasjonsnotater-indreproduktrom",
      title: "Presentasjonsnotater indreproduktrom",
      file: "/pdfs/tma4422/presentasjoner/Presentasjonsnotater indreproduktrom.pdf",
      category: "presentasjoner",
    },
    {
      id: "presentasjonsnotater-lineaertransformasjon",
      title: "Presentasjonsnotater lineærtransformasjon",
      file: "/pdfs/tma4422/presentasjoner/Presentasjonsnotater lineaertransformasjoner.pdf",
      category: "presentasjoner",
    },
    {
      id: "presentasjonsnotater-vektorrom",
      title: "Presentasjonsnotater vektorrom",
      file: "/pdfs/tma4422/presentasjoner/Presentasjonsnotater vektorrom.pdf",
      category: "presentasjoner",
    },
    {
      id: "tma4100-h25",
      title: "TMA4100 H25",
      file: "/pdfs/tma4422/eksamener/TMA4100 H25.pdf",
      category: "eksamener",
    },
    {
      id: "tma4100-k25",
      title: "TMA4100 K25",
      file: "/pdfs/tma4422/eksamener/TMA4100 K25.pdf",
      category: "eksamener",
    },
    {
      id: "tma4115-k25",
      title: "TMA4115 K25",
      file: "/pdfs/tma4422/eksamener/TMA4115 K25.pdf",
      category: "eksamener",
    },
    {
      id: "tma4115-v25",
      title: "TMA4115 V25",
      file: "/pdfs/tma4422/eksamener/TMA4115 V25.pdf",
      category: "eksamener",
    },
    {
      id: "tma4130-h24",
      title: "TMA4130 H24",
      file: "/pdfs/tma4422/eksamener/TMA4130 H24.pdf",
      category: "eksamener",
    },
    {
      id: "tma4130-35-h25",
      title: "TMA4130_35 H25",
      file: "/pdfs/tma4422/eksamener/TMA4130_35 H25.pdf",
      category: "eksamener",
    },
    {
      id: "tma4130-35-k25",
      title: "TMA4130_35 K25",
      file: "/pdfs/tma4422/eksamener/TMA4130_35 K25.pdf",
      category: "eksamener",
    },
  ],

  exph0300: [
    {
      id: "argumentasjonsteori",
      title: "Argumentasjonsteori",
      file: "/pdfs/exph0300/1) Argumentasjonsteori.pdf",
      category: "presentasjoner",
    },
    {
      id: "vitenskapsfilosofi",
      title: "Vitenskapsfilosofi",
      file: "/pdfs/exph0300/2) Vitenskapsfilosofi.pdf",
      category: "presentasjoner",
    },
    {
      id: "natursyn, menneskesyn og teknologi",
      title: "Natursyn, menneskesyn og teknologi",
      file: "/pdfs/exph0300/3) Natursyn, menneskesyn og teknologi.pdf",
      category: "presentasjoner",
    },
    {
      id: "etikk",
      title: "Etikk",
      file: "/pdfs/exph0300/4) Etikk.pdf",
      category: "presentasjoner",
    },
    {
      id: "politisk filosofi",
      title: "Politisk filosofi",
      file: "/pdfs/exph0300/5) Politisk filosofi.pdf",
      category: "presentasjoner",
    },
    {
      id: "tilleggspensum",
      title: "Tilleggspensum",
      file: "/pdfs/exph0300/6) Tilleggspensum.pdf",
      category: "presentasjoner",
    },
  ],
};
