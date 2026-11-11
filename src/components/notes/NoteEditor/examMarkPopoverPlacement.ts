// Ren plasseringslogikk for forklaringsbobler under markeringer. Ingen DOM her, så den kan testes direkte.

export type Box = { left: number; top: number; right: number; bottom: number };

export type PopoverSize = { width: number; height: number };

export type Viewport = { width: number; height: number };

export type PopoverPlacement = {
  left: number;
  top: number;
  width: number;
  maxHeight: number;
  side: "above" | "below";
};

export const POPOVER_EDGE_MARGIN = 8;
export const POPOVER_GAP = 8;
export const POPOVER_MAX_WIDTH = 320;

// Bobla plasseres over markeringen når det er plass, ellers under. Vannrett starter den ved markeringens venstre kant.
// Hvis den ikke får plass til høyre, flyttes den mot venstre. Ingen del av bobla havner utenfor skjermen.
export function placeExamMarkPopover(input: {
  // Første linje i markeringen. Ved flerlinjetekst brukes første rektangel for «over» og siste for «under».
  firstLine: Box;
  lastLine: Box;
  size: PopoverSize;
  viewport: Viewport;
}): PopoverPlacement {
  const { firstLine, lastLine, viewport } = input;
  const margin = POPOVER_EDGE_MARGIN;

  const width = Math.max(
    0,
    Math.min(POPOVER_MAX_WIDTH, viewport.width - margin * 2),
  );

  // Hvis bobla er høyere enn skjermen, begrenses den og scroller selv.
  const available = {
    above: firstLine.top - POPOVER_GAP - margin,
    below: viewport.height - lastLine.bottom - POPOVER_GAP - margin,
  };

  const fitsAbove = available.above >= input.size.height;
  const fitsBelow = available.below >= input.size.height;

  let side: "above" | "below";
  if (fitsAbove) side = "above";
  else if (fitsBelow) side = "below";
  else side = available.above >= available.below ? "above" : "below";

  const maxHeight = Math.max(
    48,
    Math.min(
      input.size.height,
      side === "above" ? available.above : available.below,
    ),
  );

  const height = Math.min(input.size.height, maxHeight);

  const top =
    side === "above"
      ? firstLine.top - POPOVER_GAP - height
      : lastLine.bottom + POPOVER_GAP;

  // Start ved venstre kant. Ikke plass til høyre gir venstre justering. Ikke plass til venstre gir kanten.
  let left = firstLine.left;
  if (left + width > viewport.width - margin) {
    left = viewport.width - margin - width;
  }
  if (left < margin) {
    left = margin;
  }

  const clampedTop = Math.min(
    Math.max(top, margin),
    Math.max(margin, viewport.height - margin - height),
  );

  return { left, top: clampedTop, width, maxHeight, side };
}
