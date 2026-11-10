# TMA4240 Statistikk: intern pensumdekning

Intern oversikt som kobler pensum, emnematrise og øvinger til de 11 temasidene i Studienotater (Supabase-topics for `tma4240`). Kilder: NTNU-wikiens pensumside og emnematrise (hentet 10.11.2026), STACK-forsøksgjennomgang 1–13 og skriftlige innleveringer 1–6 (lokale PDF-er).

Ingen formelbokinnhold er gjengitt her. Formelbokhenvisninger skal kontrolleres mot den fysiske boka.

## 1. Pensum (avgrensninger)

Lærebok: Walpole, Myers, Myers & Ye, 9. utgave. Pensum er definert for denne utgaven.

| Kapittel | Pensum | Avgrensning |
|---|---|---|
| 1 | Hele | |
| 2 | Hele | |
| 3 | Hele | |
| 4 | 4.1–4.3 | 4.3 bare til «What If the Function Is Nonlinear?» (resten, feilforplantning, er med i tema Funksjoner) |
| 5 | 5.1–5.2, 5.4–5.6 | **5.3 er ikke pensum** |
| 6 | 6.1–6.7 | |
| 7 | 7.1, 7.2, 7.3 | **Teorem 7.2 og 7.4 og tilhørende eksempler er ikke pensum** |
| 8 | 8.1–8.6, 8.8 | |
| 9 | 9.1–9.6, 9.8, 9.10, 9.12, 9.14 | **9.8 bare til «Variances Unknown but Equal»** (to-utvalg med felles varians er ikke pensum) |
| 10 | 10.1–10.4, 10.5, 10.6, 10.7, 10.8, 10.10 | **10.5 bare til «Unknown But Equal Variances»**; **10.7 bare til «Annotted Computer Printout for Two-Sample t-Test»**; **10.10 bare til «Example 10.13»** |
| 11 | 11.1–11.6, 11.10 | **11.10 fra «Diagnostic Plots of Residuals»** |
| 16 | 16.1 | Bare til eksempel 16.2 (fortegnstesten) |

Tillegg (ER = Evans & Rosenthal, E = Ernst):
- ER Kap 2.10 og 4.5 (hele): stokastisk simulering.
- E Kap 3 (hele) og 4.2: permutasjonstester.

Øvinger: alle 13 elektroniske øvinger (STACK 1–13) og alle 6 skriftlige innleveringer er pensum.

## 2. Pensumpunkt → tema → øving

Tema-ID-ene er Supabase-topics for `tma4240`. Rekkefølgen under er emnematrisens. Subtopics er Supabase-subtopics i den rekkefølgen de ligger i databasen.

| # | Tema (Supabase) | Topic-ID | Pensum (WMMY) | Emnematrise-uke | Subtopics i Supabase | Øvinger |
|---|---|---|---|---|---|---|
| 1 | Sannsynlighet | `403369a8-e1e6-49e9-98d8-958df11e9a3e` | Kap 2 hele | 34–35 | Stokastisk forsøk; Uniform; Kombinatorikk; Union; Betinget og uavhengige; Total sannsynlighet og Bayes | ES 1–2, Skr. 1 |
| 2 | Stokastiske variabler og fordelinger | `7103ce38-7dff-4aab-a220-40219eaf4fdb` | Kap 3 hele | 35 | Punktsannsynlighet og tetthet; Kumulativ fordeling og kvantiler; Simultanfordeling | ES 2 |
| 3 | Stokastisk simulering | `43900c7c-897c-45d3-b99d-44c755bda945` | ER 2.10, 4.5 | 36 | Simulering og pseudo-tilfeldige tall; Simulering fra diskrete og kontinuerlige | ES 3, Skr. 2 |
| 4 | Forventningsverdi og varians | `0f87ebbc-2345-47d7-8680-11d40d16d34f` | Kap 4.1–4.3 (til «What If…») | 36–37 | Forventning, varians, sd; Forventning av funksjoner; Kovarians og korrelasjon; Lineære funksjoner; Regneregler | ES 4, Skr. 2 |
| 5 | Viktige diskrete fordelinger | `d514c38f-f79e-4023-8f39-59b20fc984e2` | Kap 5.1–5.2, 5.4–5.6 | 37–38 | Binomisk; Geometrisk og negativ binomisk; Poissonprosess; Poisson som tilnærming til binomisk | ES 5, Skr. 3 |
| 6 | Viktige kontinuerlige fordelinger | `58e81f44-a248-4cc2-8eda-5e43fa335bac` | Kap 6.1–6.4, 6.6–6.7 | 38–39 | Normal; Eksponential; Gamma og kjikvadrat; Student t | ES 6 |
| 7 | Funksjoner av stokastiske variabler | `a2e58e76-a675-4dce-b7f5-c12315891e66` | Kap 4.3 (fra «What If…»), 6.5, 7.1, 7.2 (uten teorem 7.2/7.4), 7.3, 8.4 | 39–40 | Transformasjon; Feilforplantning; Momenter og MGF; Egenskaper ved MGF; Sentralgrenseteoremet; Normal som tilnærming til binomisk | ES 7 |
| 8 | Parameterestimering | `5288da2e-cee4-4241-9ba0-d8b2e56d8e9b` | Kap 1 hele, 8.1–8.3, 8.8, 9.1–9.5, 9.14 | 41 | Introduksjon; Histogram/boksplott; Observator og estimator; Estimering og simulering; Rimelighetsfunksjon og SME | ES 8, Skr. 4 |
| 9 | Konfidens- og prediksjonsintervall | `ecbc0608-01fe-465f-9141-3e01f8551849` | Kap 8.5–8.6, 9.2–9.6, 9.8 (til «Variances Unknown but Equal»), 9.10, 9.12 | 42 | Konfidensintervall; Utgangspunkt i ulike situasjoner; KI og simulering; KI og valg av n; Prediksjonsintervall | ES 9, Skr. 4 |
| 10 | Hypotesetesting | `998f5ead-0534-41d2-953a-c694535ec22b` | Kap 10.1–10.4, 10.5 (delvis), 10.6, 10.7 (delvis), 10.8, 10.10 (delvis), 16.1, E 3.1–3.4, 4.2 | 43–44 | Hypoteser og testobservator; Type I/II; P-verdi; Valg av testobservator; KI og tosidig test; Teststyrke; Hypotesetest og valg av n; Fortegnstesten; To-utvalg permutasjonstest | ES 10–11, Skr. 5 |
| 11 | Enkel lineær regresjon | `b58edd9e-9b6d-40a7-a4e3-a0b47ed63683` | Kap 11.1–11.6, 11.10 (fra residualplott) | 45–46 | MK-metoden; SME; Egenskaper til estimatorene; Residualer og residualplott; Inferens; Prediksjon | ES 12–13, Skr. 6 |

Stokastisk simulering har ingen eget tema i emnematrisen (ingen temaside), men er et eget tema i Studienotater. Behold det.

## 3. Gap og tvetydigheter

Disse må løses i temasidene, ikke bare i kartleggingen.

1. **Kap 8.1 er pensum, men er ikke plassert i emnematrisen.** Foreslått plassering: Parameterestimering (utvalg og utvalgsfordeling som innledning).
2. **Kap 9.10 og 9.12 er pensum, men er ikke nevnt i emnematrisens KI-rad.** De er trolig to-utvalgs-/tilnærmede intervaller. Foreslått plassering: KI. Sjekk innholdet i læreboka.
3. **To-utvalg-t med felles varians er ikke pensum** (9.8, 10.5). Ikke ta med som hovedinnhold. Eventuelt nevnes det kort som «ikke pensum».
4. **Hypergeometrisk fordeling (5.3) er ikke pensum.** Utelat den.
5. **Teorem 7.2 og 7.4 er ikke pensum.** Utelat dem i Funksjoner.
6. **Supabase har «Normal som tilnærming til binomisk» under Funksjoner, mens Walpole 6.5 ligger i Kap 6.** Emnematrisen bekrefter plasseringen under Funksjoner, så vi beholder den.
7. **4.3 er delt:** Kovarians og lineære funksjoner hører til Forventning. Feilforplantning hører til Funksjoner.
8. **Ernst (E 3, 4.2) og ER (2.10, 4.5) er pensum uten at de står i læreboka.** Ernst-innholdet hører til permutasjonstestene i Hypotesetesting. ER-innholdet hører til Stokastisk simulering.
9. **Supabase mangler egne subtopics for:** to-utvalgs-KI og -test (9.10, 9.12, 10.7), og introduksjonen til diskrete og kontinuerlige fordelinger (emnematrisen, uke 37/38). Dekkes i temasidene.

## 4. Status

- [x] Pensumavgrensning, emnematrise og øvinger kartlagt (dette dokumentet).
- [x] Alle 11 Supabase-topics identifisert og koblet til pensumpunkter. Ingen pensumpunkter mangler, bortsett fra gapene over.
- [ ] Formelbokkartlegging (39 sider, med sidetall). Ikke gjort.
- [ ] Temasidene 1–11: ingen er fylt ennå (ingen `src/data/curriculum/lessons/tma4240/`-filer).
- [ ] Tidligere eksamener (aug 2026, des 2025 m.fl.) analysert og koblet til tema. Ikke gjort.
- [ ] STACK 1–13 og innleveringer 1–6 gjennomgått i detalj. Kun kartlagt til øving/uke.
