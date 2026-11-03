// Step-by-step trace of Insertion-Sort for the lecture animation. Each step is a full
// snapshot, so the player can jump to any step and the view stays a pure function of it.

export type InsertionSortFrame = {
  /** Item ids per array position; null marks the hole left by key. */
  slots: (number | null)[];
  values: number[];
  key: number | null;
  /** Position key hovers above (the hole), or where it was just inserted. */
  keySlot: number | null;
  i: number | null;
  j: number | null;
  /** Positions 0..sorted-1 hold A[1 : i − 1], the sorted prefix. */
  sorted: number;
  compare: number | null;
  line: number | null;
  shifts: number;
  caption: string;
};

export const INSERTION_SORT_INPUT = [5, 2, 4, 6, 1, 3];

const list = (values: number[]) => `$\\langle ${values.join(", ")} \\rangle$`;

export function traceInsertionSort(input: number[] = INSERTION_SORT_INPUT): InsertionSortFrame[] {
  const values = [...input];
  const slots: (number | null)[] = values.map((_, index) => index);
  const frames: InsertionSortFrame[] = [];
  let shifts = 0;
  const snap = (frame: Omit<InsertionSortFrame, "slots" | "values" | "shifts">) => frames.push({ ...frame, slots: [...slots], values, shifts });
  const shown = () => slots.map(id => (id === null ? "_" : values[id]));

  snap({ key: null, keySlot: null, i: null, j: null, sorted: 1, compare: null, line: null,
    caption: `Vi sorterer ${list(values)}. Det første elementet alene er allerede sortert, så vi starter med $i = 2$.` });
  for (let i = 1; i < slots.length; i++) {
    const key = slots[i]!;
    slots[i] = null;
    let j = i - 1;
    snap({ key, keySlot: i, i: i + 1, j: j + 1, sorted: i, compare: null, line: 2,
      caption: `Runde $i = ${i + 1}$: vi løfter ut $key = ${values[key]}$ og setter $j = ${j + 1}$.` });
    while (j >= 0 && values[slots[j]!] > values[key]) {
      const moved = values[slots[j]!];
      slots[j + 1] = slots[j];
      slots[j] = null;
      shifts++;
      snap({ key, keySlot: j, i: i + 1, j: j + 1, sorted: i, compare: j + 1, line: 5,
        caption: `$A[${j + 1}] = ${moved}$ er større enn $key = ${values[key]}$, så ${moved} flyttes ett hakk til høyre.` });
      j--;
    }
    if (j >= 0) snap({ key, keySlot: j + 1, i: i + 1, j: j + 1, sorted: i, compare: j, line: 4,
      caption: `$A[${j + 1}] = ${values[slots[j]!]}$ er ikke større enn $key = ${values[key]}$, så while-løkka stopper.` });
    slots[j + 1] = key;
    snap({ key: null, keySlot: j + 1, i: i + 1, j: j + 1, sorted: i + 1, compare: null, line: 7,
      caption: `${j < 0 ? "Vi har nådd starten av tabellen. " : ""}$key = ${values[key]}$ settes inn på plass ${j + 2}. Nå er $A[1:${i + 1}]$ sortert: ${list(shown().slice(0, i + 1) as number[])}.` });
  }
  snap({ key: null, keySlot: null, i: null, j: null, sorted: slots.length, compare: null, line: null,
    caption: `Ferdig: ${list(shown() as number[])}. Det ble ${shifts} flyttinger, like mange som antall inversjoner i input.` });
  return frames;
}

export const insertionSortSteps = () => traceInsertionSort().map(({ caption }) => ({ caption }));
