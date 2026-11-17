import { useEffect, useState } from "react";
import { createPrivateStorageUrl, withTimeout } from "../services/media/privateStorage";

const PDF_URL_TIMEOUT_MS = 15000;

// Engangsforespørsel for én PDF i eksamensvisningen. Ingen delt abonnement, så en avbrutt auth-hendelse
// eller en utdatert forespørsel kan ikke holde visningen i «Laster» for alltid.
export function useExamPdfUrl(path: string | null) {
  const [result, setResult] = useState<{ path: string; url: string | null; error: string | null } | null>(null);

  useEffect(() => {
    if (!path) return;

    let cancelled = false;

    withTimeout(
      createPrivateStorageUrl("pdfs", path),
      PDF_URL_TIMEOUT_MS,
      "Filtilgangen tok for lang tid. Last siden på nytt.",
    )
      .then((url) => {
        if (!cancelled) setResult({ path, url, error: null });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setResult({
          path,
          url: null,
          error: error instanceof Error ? error.message : "Kunne ikke åpne filen.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  if (!path) return { url: null, loading: false, error: null };

  const current = result && result.path === path ? result : null;

  return {
    url: current?.url ?? null,
    loading: current === null,
    error: current?.error ?? null,
  };
}
