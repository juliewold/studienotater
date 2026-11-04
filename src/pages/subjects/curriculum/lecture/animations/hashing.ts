// Step-by-step traces for lecture 2a: a hash table with chaining (the example of the figure, with
// h(k) = k mod 9), and a table that doubles when it is full (Table-Insert). Both are shown as the data
// structure changes, one event at a time.

export type ChainingFrame = {
  caption: string;
  /** The chains: for each slot, the keys from the head of the list. */
  slots: number[][];
  /** The key being inserted or searched for, and the slot it hashes to. */
  key: number | null;
  slot: number | null;
  /** The node in the chain being compared, when searching. */
  visiting: number | null;
  found: boolean;
};

/** Keys 5, 28, 19, 15, 20, 33, 12, 17, 10 inserted with h(k) = k mod m, and List-Prepend in each chain. */
export function traceChaining(keys = [5, 28, 19, 15, 20, 33, 12, 17, 10], m = 9, search = 15): ChainingFrame[] {
  const slots: number[][] = Array.from({ length: m }, () => []);
  const frames: ChainingFrame[] = [];
  const snap = (frame: Pick<ChainingFrame, "caption" | "key" | "slot" | "visiting" | "found">) =>
    frames.push({ ...frame, slots: slots.map(chain => [...chain]) });

  snap({ key: null, slot: null, visiting: null, found: false, caption: `Vi lager en hashtabell med ${m} plasser og kjeding: hver plass har en lenkeliste med nøklene som hasher dit. Hashfunksjonen er h(k) = k mod ${m}.` });
  for (const k of keys) {
    const slot = k % m;
    snap({ key: k, slot, visiting: null, found: false, caption: `Vi setter inn ${k}. h(${k}) = ${k} mod ${m} = ${slot}, så ${k} hører til plass ${slot}.` });
    slots[slot].unshift(k);
    snap({ key: k, slot, visiting: null, found: false, caption: slots[slot].length === 1
      ? `Plass ${slot} var tom, så ${k} blir den eneste i lenkelisten.`
      : `${k} settes først i lenkelisten på plass ${slot}, med List-Prepend. Det tar konstant tid, uansett hvor lang lenken er.` });
  }

  // Searching walks the chain from the head, so the cost is the length of the chain.
  const target = search, slot = target % m;
  snap({ key: target, slot, visiting: null, found: false, caption: `Søk etter ${target}: h(${target}) = ${slot}, så vi går gjennom lenkelisten på plass ${slot}, fra starten.` });
  let found = false;
  for (const k of slots[slot]) {
    found = k === target;
    snap({ key: target, slot, visiting: k, found, caption: found
      ? `${k} er lik ${target}. Søket er ferdig.`
      : `${k} er ikke ${target}, så vi går videre til neste node i lenken.` });
    if (found) break;
  }
  const longest = Math.max(...slots.map(chain => chain.length));
  snap({ key: null, slot: null, visiting: null, found, caption: `Lenkene er ferdige. Lengste lenke har ${longest} nøkler, og lastfaktoren er ${keys.length} / ${m}. Et søk tar tid i lengden av lenken, ikke i tabellens størrelse.` });
  return frames;
}

export type DoublingFrame = {
  caption: string;
  /** Index into the lines of Table-Insert(T, x). */
  line: number | null;
  /** The table of the current size; null for empty places. */
  table: (number | null)[];
  num: number;
  size: number;
  /** Elements copied into a new table in this step, and in total so far. */
  copied: number;
  copies: number;
  /** The position written in this step, if any. */
  written: number | null;
};

export function traceDoubling(keys = Array.from({ length: 17 }, (_, index) => index + 1)): DoublingFrame[] {
  let table: (number | null)[] = [];
  let num = 0, size = 0, copies = 0;
  const frames: DoublingFrame[] = [];
  const snap = (frame: Pick<DoublingFrame, "caption" | "line" | "copied" | "written">) =>
    frames.push({ ...frame, table: [...table], num, size, copies });

  snap({ line: null, copied: 0, written: null, caption: `Vi setter inn ${keys.length} elementer i en tabell som dobler seg når den blir full. Tabellen starter tom, med størrelse 0.` });
  for (const x of keys) {
    if (size === 0) {
      size = 1;
      table = [null];
      snap({ line: 1, copied: 0, written: null, caption: `Tabellen er tom, så vi lager plass til ett element.` });
    }
    if (num === size) {
      const oldSize = size;
      size = 2 * size;
      const bigger: (number | null)[] = Array(size).fill(null);
      for (let index = 0; index < oldSize; index++) bigger[index] = table[index];
      table = bigger;
      copies += oldSize;
      snap({ line: 4, copied: 0, written: null, caption: `Tabellen er full med ${num === 1 ? "ett element" : `${num} elementer`}. Vi lager en ny tabell med størrelse ${size}.` });
      snap({ line: 5, copied: oldSize, written: null, caption: `Vi kopierer de ${oldSize} elementene over i den nye tabellen. Det er ${oldSize} kopieringer, og de er nødvendige fordi alt må flyttes.` });
    }
    table[num] = x;
    snap({ line: 9, copied: 0, written: num, caption: `Vi setter inn ${x} på plass ${num + 1}. Nå har tabellen ${num + 1} elementer, av størrelse ${size}.` });
    num++;
  }
  snap({ line: null, copied: 0, written: null, caption: `Alle ${keys.length} elementene er satt inn. Totalt er det ${copies} kopieringer, altså ${(copies / keys.length).toFixed(1).replace(".", ",")} i snitt per innsetting. Det holder seg konstant, så innsetting er amortisert O(1).` });
  return frames;
}
