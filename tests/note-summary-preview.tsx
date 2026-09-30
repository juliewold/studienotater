import { createRoot } from 'react-dom/client';
import { NoteSummary } from '../src/components/notes/NoteSummary/NoteSummary';
// This isolated UI fixture makes no real AI requests or database writes.
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  if (String(input).endsWith('/summarize-note/')) {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (init?.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    if ((document.getElementById('fail') as HTMLInputElement).checked) return Response.json({error:'Kunne ikke nå AI-tjenesten. Prøv igjen senere.'}, {status:503});
    return Response.json({summary: '• En stokastisk variabel beskriver utfallet av et forsøk.\n• Forventning er et vektet gjennomsnitt.'});
  }
  throw new Error('Unexpected request in isolated preview');
};
window.addEventListener('pagehide', () => { window.fetch = originalFetch; });
createRoot(document.getElementById('preview')!).render(<NoteSummary content="<p>En stokastisk variabel beskriver utfallet av et forsøk. Forventning er et vektet gjennomsnitt.</p>" />);
