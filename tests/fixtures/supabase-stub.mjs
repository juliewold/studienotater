// Testdouble for src/lib/supabase.ts. Ingen nettverkskall. Oppførselen styres av globalThis.__supabaseStub.
const stub = () => globalThis.__supabaseStub;

function respond(table, ops) {
  const s = stub();
  const names = ops.map(([name]) => name);
  if (table === "exams" && names.includes("update")) {
    s.updates.push(ops);
    return s.updateResult;
  }
  if (table === "exams" && names.includes("or")) return s.examReferences;
  if (table === "pdfs") return s.pdfReferences;
  return { data: null, error: new Error("Uventet spørring") };
}

export const supabase = {
  from(table) {
    const ops = [];
    const builder = new Proxy({}, {
      get(_, name) {
        if (name === "then") {
          return (resolve, reject) => Promise.resolve(respond(table, ops)).then(resolve, reject);
        }
        return (...args) => {
          ops.push([name, args]);
          return builder;
        };
      },
    });
    return builder;
  },
  storage: {
    from(bucket) {
      return {
        remove: async (paths) => {
          stub().removed.push({ bucket, paths });
          return stub().removeResult;
        },
      };
    },
  },
};
