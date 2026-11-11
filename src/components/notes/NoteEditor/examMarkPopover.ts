import { examMarkKindLabels, EXAM_MARK_KINDS, type ExamMarkKind } from "./examMarkKinds";
import {
  placeExamMarkPopover,
  POPOVER_MAX_WIDTH,
  POPOVER_EDGE_MARGIN,
} from "./examMarkPopoverPlacement";

// Forklaringsboble for alle markeringer i Notater. Bobla ligger i <body> og posisjoneres
// med fixed, så den ikke klippes av notatbokser, sidepanel eller scroll-containere.
//
// Hover viser forklaringen på mus. Klikk eller trykk fester den, og den lukkes med
// nytt klikk, med Escape, med klikk utenfor eller med lukkeknappen.

const MARK_SELECTOR = "mark.exam-mark";
const POPOVER_ID = "exam-mark-popover";

let installed = false;
let popover: HTMLDivElement | null = null;
let activeMark: HTMLElement | null = null;
let pinned = false;
let frame = 0;

const markKindOf = (mark: HTMLElement): ExamMarkKind => {
  const kind = mark.getAttribute("data-exam-kind") ?? "";
  return (EXAM_MARK_KINDS as readonly string[]).includes(kind) ? (kind as ExamMarkKind) : "data";
};

function ensurePopover(): HTMLDivElement {
  if (popover) return popover;

  const element = document.createElement("div");
  element.id = POPOVER_ID;
  element.className = "exam-mark-popover";
  element.setAttribute("role", "tooltip");
  element.hidden = true;
  document.body.appendChild(element);
  popover = element;
  return element;
}

function renderContent(mark: HTMLElement, isPinned: boolean) {
  const element = ensurePopover();
  element.replaceChildren();

  const header = document.createElement("div");
  header.className = "exam-mark-popover-header";

  const label = document.createElement("strong");
  label.textContent = examMarkKindLabels[markKindOf(mark)];
  header.appendChild(label);

  if (isPinned) {
    const close = document.createElement("button");
    close.type = "button";
    close.className = "exam-mark-popover-close";
    close.setAttribute("aria-label", "Lukk forklaring");
    close.textContent = "×";
    close.addEventListener("click", () => hideExamMarkPopover());
    header.appendChild(close);
  }

  const text = document.createElement("p");
  text.className = "exam-mark-popover-text";
  text.textContent = mark.getAttribute("data-exam-explanation") || "Ingen forklaring er skrevet.";

  element.append(header, text);
}

// Bobla måles etter bredde, og plasseres så den får plass helt innenfor skjermen.
function positionPopover() {
  if (!popover || !activeMark || popover.hidden) return;

  const rects = Array.from(activeMark.getClientRects());
  if (rects.length === 0) {
    hideExamMarkPopover();
    return;
  }

  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = window.innerHeight;

  // Hvis markeringen er helt utenfor skjermen, lukkes bobla i stedet for å henge i luften.
  const visible = rects.some((rect) => rect.bottom > 0 && rect.top < viewportHeight);
  if (!visible) {
    hideExamMarkPopover();
    return;
  }

  const firstLine = rects.reduce((a, b) => (b.top < a.top ? b : a));
  const lastLine = rects.reduce((a, b) => (b.bottom > a.bottom ? b : a));

  const width = Math.min(POPOVER_MAX_WIDTH, viewportWidth - POPOVER_EDGE_MARGIN * 2);
  popover.style.position = "fixed";
  popover.style.width = `${width}px`;
  popover.style.maxHeight = "";

  const height = popover.offsetHeight;

  const placement = placeExamMarkPopover({
    firstLine: { left: firstLine.left, top: firstLine.top, right: firstLine.right, bottom: firstLine.bottom },
    lastLine: { left: lastLine.left, top: lastLine.top, right: lastLine.right, bottom: lastLine.bottom },
    size: { width, height },
    viewport: { width: viewportWidth, height: viewportHeight },
  });

  popover.style.left = `${placement.left}px`;
  popover.style.top = `${placement.top}px`;
  popover.style.maxHeight = `${placement.maxHeight}px`;
  popover.dataset.side = placement.side;
}

function showExamMarkPopover(mark: HTMLElement, isPinned: boolean) {
  activeMark = mark;
  pinned = isPinned;
  renderContent(mark, isPinned);
  const element = ensurePopover();
  element.hidden = false;
  positionPopover();
}

export function hideExamMarkPopover() {
  if (popover) popover.hidden = true;
  activeMark = null;
  pinned = false;
}

function schedulePosition() {
  if (!popover || popover.hidden || frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    positionPopover();
  });
}

// Installeres én gang per dokument. Hendelser fanges i capture-fasen, så redigeringsverktøy
// og tastatur-/klikkhåndtering i editoren ikke stopper dem.
export function installExamMarkPopover() {
  if (installed || typeof document === "undefined") return;
  installed = true;

  document.addEventListener(
    "pointerover",
    (event) => {
      if (event.pointerType !== "mouse" || pinned) return;
      const mark = (event.target as Element | null)?.closest<HTMLElement>(MARK_SELECTOR);
      if (mark) showExamMarkPopover(mark, false);
    },
    true,
  );

  document.addEventListener(
    "pointerout",
    (event) => {
      if (!activeMark || pinned) return;
      const from = (event.target as Element | null)?.closest<HTMLElement>(MARK_SELECTOR);
      if (from !== activeMark) return;
      const to = event.relatedTarget as Node | null;
      if (to && activeMark.contains(to)) return;
      hideExamMarkPopover();
    },
    true,
  );

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target as Element | null;
      const mark = target?.closest<HTMLElement>(MARK_SELECTOR);
      if (mark) {
        // Klikk på samme markering igjen lukker bobla. Klikk på en annen markering fester den nye.
        if (pinned && activeMark === mark) hideExamMarkPopover();
        else showExamMarkPopover(mark, true);
        return;
      }
      if (popover && !popover.hidden && !popover.contains(target)) {
        if (pinned) hideExamMarkPopover();
      }
    },
    true,
  );

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hideExamMarkPopover();
  });

  window.addEventListener("scroll", schedulePosition, { capture: true, passive: true });
  window.addEventListener("resize", schedulePosition);
}
