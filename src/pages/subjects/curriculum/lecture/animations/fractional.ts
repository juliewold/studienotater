// Step-by-step trace of Fractional-Knapsack(v, w, n, W) from lecture 7, on the three items of CLRS 16.2. Items
// are taken greedily by value per kilo, and the last item is taken in part. Each step shows how much of the
// capacity is left and what has been taken.

export type FractionalItem = { name: string; value: number; weight: number };

export type FractionalFrame = {
  caption: string;
  /** Index into the lines of Fractional-Knapsack(v, w, n, W). */
  line: number | null;
  /** The items in order of value per kilo, with the amount taken of each so far. */
  items: (FractionalItem & { ratio: number; taken: number })[];
  /** The item being considered, as an index into `items`. */
  current: number | null;
  capacity: number;
  total: number;
};

export const fractionalItems: FractionalItem[] = [
  { name: "A", value: 60, weight: 10 },
  { name: "B", value: 100, weight: 20 },
  { name: "C", value: 120, weight: 30 },
];

export function traceFractional(input = fractionalItems, W = 50): FractionalFrame[] {
  const items = [...input].sort((a, b) => b.value / b.weight - a.value / a.weight)
    .map(item => ({ ...item, ratio: item.value / item.weight, taken: 0 }));
  const frames: FractionalFrame[] = [];
  let capacity = W, total = 0;
  const snap = (frame: Pick<FractionalFrame, "caption" | "line" | "current">) =>
    frames.push({ ...frame, items: items.map(item => ({ ...item })), capacity, total });
  const money = (value: number) => (Number.isInteger(value) ? String(value) : value.toFixed(1).replace(".", ","));

  snap({ line: 0, current: null, caption: `Vi sorterer gjenstandene etter verdi per kilo: ${items.map(item => `${item.name} (${money(item.ratio)} per kilo)`).join(", ")}. Sekken har plass til ${W} kilo.` });
  snap({ line: 1, current: null, caption: `Vi har ingen verdi ennå, og ${capacity} kilo igjen i sekken.` });
  let i = 0;
  while (capacity > 0 && i < items.length) {
    const item = items[i];
    snap({ line: 3, current: i, caption: `Vi ser på ${item.name}, som har ${money(item.ratio)} per kilo. Det er fortsatt ${capacity} kilo igjen, og ${item.name} veier ${item.weight}.` });
    const x = Math.min(item.weight, capacity);
    item.taken = x;
    total += x * item.ratio;
    capacity -= x;
    snap({ line: 5, current: i, caption: x === item.weight
      ? `Vi tar hele ${item.name}: ${item.weight} kilo, med verdi ${item.value}. Verdien blir ${money(total)}.`
      : `Vi tar bare ${x} av de ${item.weight} kiloene i ${item.name}, fordi resten av sekken er full. Det gir ${money(x * item.ratio)} i verdi, og verdien blir ${money(total)}.` });
    snap({ line: 6, current: i, caption: capacity === 0 ? `Sekken er full, så vi er ferdige.` : `Det er ${capacity} kilo igjen i sekken.` });
    i++;
  }
  snap({ line: 8, current: null, caption: `Den største verdien er ${money(total)}. Grådigheten er riktig her, fordi ${items[0].name} har høyest verdi per kilo og kan delvis tas med.` });
  return frames;
}
