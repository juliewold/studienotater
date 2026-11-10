import type { Lesson } from "../types";
import { RegressionFigure } from "./figures";

// Tema 11, Enkel lineær regresjon. Pensum: WMMY 11.1–11.6 og 11.10 (fra «Diagnostic Plots of Residuals»).
// Formelbok: side 36 (MK-estimatorer, S², fordeling), 35 (lineærkombinasjon), 27 (t-fordeling), 4 (t-kritisk).

const formelbok = (pages: string) => `(Formelbok ${pages})`;

export const lesson: Lesson = {
  subjectId: "tma4240",
  unitId: "b58edd9e-9b6d-40a7-a4e3-a0b47ed63683",
  reviewed: "2026-11-10",
  summary: "Enkel lineær regresjon modellerer en respons $Y$ som en rett linje i $x$ med normalt støy. **Minste kvadraters metode** gir estimatene $\\hat{\\alpha}$ og $\\hat{\\beta}$. Inferens om $\\beta$ bruker $t$-fordelingen med $n - 2$ frihetsgrader. For et nytt punkt skiller du mellom **forventet verdi** og **prediksjonsintervall**. Residualene viser om modellen passer.",
  overview: [
    "**Modell:** $Y_i = \\alpha + \\beta x_i + \\varepsilon_i$, der $\\varepsilon_i$ er uavhengige og $N(0, \\sigma^2)$.",
    "**MK-estimater:** $\\hat{\\beta} = S_{xy}/S_{xx}$ og $\\hat{\\alpha} = \\bar{y} - \\hat{\\beta}\\bar{x}$, der $S_{xx} = \\sum(x_i - \\bar{x})^2$ og $S_{xy} = \\sum(x_i - \\bar{x})(y_i - \\bar{y})$.",
    "**Variansestimat:** $S^2 = \\frac{1}{n-2}\\sum(y_i - \\hat{\\alpha} - \\hat{\\beta}x_i)^2$, og $(n-2)S^2/\\sigma^2 \\sim \\chi^2_{n-2}$.",
    "**Inferens om β:** $(\\hat{\\beta} - \\beta)/(S/\\sqrt{S_{xx}}) \\sim t_{n-2}$. Gir KI og test.",
    "**Prediksjon:** KI for forventet verdi er smalere enn prediksjonsintervall for en ny observasjon. Begge er smalest nær $\\bar{x}$.",
    "**Residualer:** $e_i = y_i - \\hat{y}_i$. Skal ikke vise mønster mot $\\hat{y}$ eller $x$, og skal ligne normal støy.",
  ],
  keyFormulas: [
    { latex: "\\hat{\\beta} = \\dfrac{\\sum (x_i - \\bar{x})(Y_i - \\bar{Y})}{\\sum (x_i - \\bar{x})^2}, \\qquad \\hat{\\alpha} = \\bar{Y} - \\hat{\\beta}\\bar{x}", label: "Minste kvadraters estimater" },
    { latex: "S^2 = \\dfrac{1}{n-2}\\sum_{i=1}^{n}(Y_i - \\hat{\\alpha} - \\hat{\\beta}x_i)^2, \\qquad \\dfrac{(n-2)S^2}{\\sigma^2} \\sim \\chi^2_{n-2}", label: "Variansestimat" },
    { latex: "\\hat{\\beta} \\pm t_{\\alpha/2,\\,n-2}\\dfrac{S}{\\sqrt{S_{xx}}}", label: "KI for β" },
    { latex: "\\hat{\\alpha} + \\hat{\\beta}x_0 \\pm t_{\\alpha/2,\\,n-2}\\,S\\sqrt{\\dfrac{1}{n} + \\dfrac{(x_0-\\bar{x})^2}{S_{xx}}}", label: "KI for forventet verdi ved x₀" },
  ],
  goals: [
    "Kunne regne ut $\\hat{\\alpha}$, $\\hat{\\beta}$, residualer og $S^2$ fra et datasett.",
    "Kunne lage KI og test for β med $t_{n-2}$.",
    "Kunne skille mellom KI for forventet verdi og prediksjonsintervall.",
    "Kunne lese residualplott og si hva de sier om modellen.",
  ],
  concepts: [],
  notes: [],
  sources: [
    { label: "Formelboka, side 4, 27, 35–36", url: "https://drive.google.com/drive/folders/1RFmuX9CyEojutvWXDIDjA6GYzcXMv0MK", kind: "drive" },
    { label: "Pensum (NTNU-wiki)", url: "https://wiki.math.ntnu.no/tma4240/2026h/pensum", kind: "drive" },
  ],
  sections: [
    {
      id: "modell",
      title: "Modellen",
      blocks: [
        { type: "text", text: "$x$ er forklaringsvariabelen, og er kjent eller satt av deg. $Y$ er responsen. Modellen sier at forventet respons ligger på en rett linje, og at avviket er normalt med konstant varians." },
        { type: "formula", latex: "Y_i = \\alpha + \\beta x_i + \\varepsilon_i, \\qquad \\varepsilon_i \\sim N(0, \\sigma^2) \\text{ uavhengige}", name: "Enkel lineær regresjon", caption: `Formelboka ${formelbok("s. 36")} gir $E(Y_i) = \\alpha + \\beta x_i$.` },
        { type: "figure", component: RegressionFigure, caption: "Datapunktene, den fitted linjen og residualene (stiplede linjer) for eksempelet under." },
      ],
    },
    {
      id: "mk",
      title: "Minste kvadraters metode",
      blocks: [
        { type: "formula", latex: "\\hat{\\beta} = \\dfrac{S_{xy}}{S_{xx}}, \\qquad \\hat{\\alpha} = \\bar{y} - \\hat{\\beta}\\bar{x}, \\qquad S_{xx} = \\sum (x_i - \\bar{x})^2, \\quad S_{xy} = \\sum (x_i - \\bar{x})(y_i - \\bar{y})", name: "Minste kvadraters estimater", caption: `Formelboka ${formelbok("s. 36")} med samme definisjoner. $S_{xx}$ og $S_{xy}$ er ikke navngitt i boka.` },
        { type: "example", title: "Fem punkter", blocks: [
          { type: "text", text: "$x = (1, 2, 3, 4, 5)$ og $y = (2, 4, 5, 4, 5)$. $\\bar{x} = 3$, $\\bar{y} = 4$. $S_{xx} = 10$ og $S_{xy} = (-2)(-2) + (-1)(0) + 0 \\cdot 1 + 1 \\cdot 0 + 2 \\cdot 1 = 6$." },
          { type: "text", text: "$\\hat{\\beta} = 6/10 = 0{,}6$ og $\\hat{\\alpha} = 4 - 0{,}6 \\cdot 3 = 2{,}2$. Fitted linje: $\\hat{y} = 2{,}2 + 0{,}6x$." },
          { type: "text", text: "Residualene er $(-0{,}8;\\ 0{,}6;\\ 1{,}0;\\ -0{,}6;\\ -0{,}2)$. Summen av kvadrerte residualer er $2{,}4$, så $S^2 = 2{,}4/3 = 0{,}8$ og $S = 0{,}894$." },
        ] },
        { type: "box", variant: "tip", title: "Tankegang", blocks: [
          { type: "text", text: "Regn ut $S_{xx}$ og $S_{xy}$ først, og bruk dem til både $\\hat{\\beta}$ og standardfeilen. Det gir færre feil enn å regne fra rådata." },
        ] },
      ],
    },
    {
      id: "inferens",
      title: "Inferens om β",
      blocks: [
        { type: "formula", latex: "\\hat{\\beta} \\sim N\\!\\left(\\beta, \\dfrac{\\sigma^2}{S_{xx}}\\right), \\qquad \\dfrac{\\hat{\\beta} - \\beta}{S/\\sqrt{S_{xx}}} \\sim t_{n-2}", name: "Fordelingen av β̂", caption: `Den normale fordelingen følger av lineærkombinasjon ${formelbok("s. 35")}. $t$-fordelingen og $(n-2)S^2/\\sigma^2 \\sim \\chi^2_{n-2}$ står på side 36 og 27.` },
        { type: "example", title: "KI og test for β i eksempelet", blocks: [
          { type: "text", text: "Standardfeil: $S/\\sqrt{S_{xx}} = 0{,}894/3{,}162 = 0{,}283$. Med $t_{0{,}025, 3} = 3{,}182$ (side 4) er 95 % KI for β: $0{,}6 \\pm 3{,}182 \\cdot 0{,}283 = (-0{,}30;\\ 1{,}50)$." },
          { type: "text", text: "Test $H_0: \\beta = 0$: $t = 0{,}6/0{,}283 = 2{,}12$ med 3 frihetsgrader. Tosidig $p$-verdi er mellom 0,10 og 0,20. Intervallet inneholder 0, så $H_0$ forkastes ikke på 5 %-nivå." },
        ] },
        { type: "box", variant: "pitfall", title: "Vanlig feil", blocks: [
          { type: "text", text: "Å bruke $z$ eller $t_{n-1}$ for β. Frihetsgradene er $n - 2$, fordi to parametre ($\\alpha$ og $\\beta$) er estimert." },
        ] },
      ],
    },
    {
      id: "prediksjon",
      title: "Forventet verdi og prediksjon",
      blocks: [
        { type: "formula", latex: "\\hat{\\alpha} + \\hat{\\beta}x_0 \\pm t_{\\alpha/2,\\,n-2}\\,S\\sqrt{\\dfrac{1}{n} + \\dfrac{(x_0-\\bar{x})^2}{S_{xx}}}", name: "KI for forventet verdi", caption: "Ikke i formelboka. Usikkerheten i linjen ved $x_0$." },
        { type: "formula", latex: "\\hat{\\alpha} + \\hat{\\beta}x_0 \\pm t_{\\alpha/2,\\,n-2}\\,S\\sqrt{1 + \\dfrac{1}{n} + \\dfrac{(x_0-\\bar{x})^2}{S_{xx}}}", name: "Prediksjonsintervall", caption: "Ikke i formelboka. Leddet $1$ er støyen i den nye observasjonen. Det gjør intervallet bredere." },
        { type: "example", title: "Ved $x_0 = 3$", blocks: [
          { type: "text", text: "$\\hat{y} = 2{,}2 + 0{,}6 \\cdot 3 = 4{,}0$. Ved $x_0 = \\bar{x}$ er $(x_0 - \\bar{x})^2 = 0$." },
          { type: "text", text: "KI for forventet verdi: $4{,}0 \\pm 3{,}182 \\cdot 0{,}894 \\cdot \\sqrt{1/5} = 4{,}0 \\pm 1{,}27$, altså $(2{,}73;\\ 5{,}27)$." },
          { type: "text", text: "Prediksjonsintervall: $4{,}0 \\pm 3{,}182 \\cdot 0{,}894 \\cdot \\sqrt{6/5} = 4{,}0 \\pm 3{,}12$, altså $(0{,}88;\\ 7{,}12)$." },
        ] },
        { type: "box", variant: "pitfall", title: "Vanlige feil", blocks: [
          { type: "list", items: [
            "Å ekstrapolere langt utenfor området av $x$-verdier i dataene.",
            "Å forveksle KI for forventet verdi med prediksjonsintervall for en ny måling.",
          ] },
        ] },
      ],
    },
    {
      id: "residualer",
      title: "Residualer og modellkontroll",
      blocks: [
        { type: "text", text: "Residualene er estimater av støyen $\\varepsilon_i$. Plott $e_i$ mot $\\hat{y}_i$ og mot $x_i$. Et tilfeldig spredt bånd rundt null betyr at modellen passer. Et buet mønster betyr at linjen er feil. Et trakt-mønster betyr at variansen ikke er konstant." },
        { type: "list", items: [
          "**Buet mønster:** lineær modell passer ikke. Vurder transformasjon eller ekstra ledd.",
          "**Trakt:** variansen øker eller minker med $x$.",
          "**QQ-plott av residualer:** punktene skal ligge nær en rett linje hvis støyen er normal.",
          "**Utligger eller innflytelsespunkt:** ett punkt kan styre hele $\\hat{\\beta}$. Sjekk hva som skjer når du fjerner det.",
        ] },
        { type: "formula", latex: "r = \\dfrac{S_{xy}}{\\sqrt{S_{xx} S_{yy}}}, \\qquad r^2 = \\dfrac{\\text{forklart variasjon}}{\\text{total variasjon}}", name: "Korrelasjon og forklaringsgrad", caption: "Ikke i formelboka. $r$ måler lineær sammenheng. $r^2$ er andelen av variasjonen i $Y$ som forklares av $x$." },
        { type: "example", title: "Samme data", blocks: [
          { type: "text", text: "$S_{yy} = 6$, så $r = 6/\\sqrt{10 \\cdot 6} = 0{,}775$ og $r^2 = 0{,}60$." },
        ] },
      ],
    },
    {
      id: "feil",
      title: "Typiske feil",
      blocks: [
        { type: "list", items: [
          "Å tro at $r = 0$ betyr at det ikke er sammenheng. Det betyr bare at det ikke er lineær sammenheng.",
          "Å bruke regresjon av $x$ på $y$ når oppgaven spør om $y$ gitt $x$. Retningen betyr noe.",
          "Å glemme å sjekke residualene før du tolker KI og test.",
        ] },
      ],
    },
    {
      id: "eksamen",
      title: "Eksamensoppgaver og metodevalg",
      blocks: [
        { type: "table", head: ["Oppgavetype", "Eksamen", "Metodevalg"], rows: [
          ["Stigningstall i log-lineær modell", "Des 2025, oppg. 6a", "$\\hat\\beta_1 = \\sum(t_i - \\bar t)\\ln k_i \\,/\\, \\sum(t_i - \\bar t)^2$. Standardfeil: $s/\\sqrt{\\sum(t_i - \\bar t)^2}$ (formelbok s. 36)."],
          ["Halveringstid", "Des 2025, oppg. 6b", "Forventet verdi går som $e^{\\beta_1 t}$. Løs $e^{\\beta_1 t_{1/2}} = 1/2$. Feilforplantning gir standardfeilen (formelbok s. 35)."],
        ] },
        { type: "example", title: "Des 2025, oppg. 6a: stigning og standardfeil", blocks: [
          { type: "text", text: "$\\sum(t_i - \\bar t)\\ln k_i = -143{,}6$ og $\\sum(t_i - \\bar t)^2 = 825$. Da er $\\hat\\beta_1 = -143{,}6/825 = -0{,}174$." },
          { type: "text", text: "Med $\\text{SSE} = 3{,}19$ og $n - 2 = 98$ er $s^2 = 3{,}19/98 = 0{,}03255$, og $\\text{SE}(\\hat\\beta_1) = \\sqrt{0{,}03255/825} = 0{,}00628$." },
        ] },
        { type: "example", title: "Des 2025, oppg. 6b: halveringstid", blocks: [
          { type: "text", text: "$t_{1/2} = -\\ln 2/\\hat\\beta_1 = 0{,}693/0{,}174 \\approx 3{,}98$ timer." },
          { type: "text", text: "Feilforplantning gir $\\text{SE}(\\hat t_{1/2}) \\approx \\frac{\\ln 2}{\\hat\\beta_1^2}\\,\\text{SE}(\\hat\\beta_1) = \\frac{0{,}693}{0{,}0303} \\cdot 0{,}00628 \\approx 0{,}144$ timer." },
        ] },
      ],
    },
  ],
};
