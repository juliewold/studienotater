import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { EditableNote } from '../src/components/notes/EditableNote/EditableNote';
import { ReadOnlyNote } from '../src/components/notes/ReadOnlyNote/ReadOnlyNote';
import { PdfSummaryModal } from '../src/components/media/PdfSummaryModal/PdfSummaryModal';
import type { DatabaseNote } from '../src/services/notes/notesService';
import '../src/index.css';
import '../src/components/layout/Navbar/Navbar.css';
// No real backend or PDF needed; all requests remain local to this fixture.
window.fetch = async () => Response.json([]);
const content = Array.from({ length: 8 }, (_, index) => `<h2>Del ${index + 1}</h2><p>${'En forelesningsoppsummering med nok tekst til å teste navigasjon. '.repeat(22)}</p>`).join('');
const note = {
  id: 'pdf-preview', subjectId: 'test', slug: 'pdf-preview', title: 'Forelesningsoppsummering',
  description: 'Test av innholdsfortegnelsen i PDF-dialogen.', content,
  folderId: null, subtopicId: null, subtopicName: null, topicId: null, topicName: null,
  contentJson: null, createdAt: '',
} satisfies DatabaseNote;
export function PdfSummaryNavigationPreview() {
  const [open, setOpen] = useState(false);
  return <>
    <nav className="navbar"><span>Studienotater</span></nav>
    <main style={{ maxWidth: 1100, margin: '24px auto', padding: 16 }}>
      <button onClick={() => setOpen(true)}>Åpne PDF-oppsummering</button>
      <ReadOnlyNote content={content}/>
    </main>
    <PdfSummaryModal isOpen={open} onClose={() => setOpen(false)}>
      <EditableNote note={note} subjectCode="TMA4240" isAdmin onNoteUpdated={() => {}} showClassification={false}/>
    </PdfSummaryModal>
  </>;
}
createRoot(document.getElementById('root')!).render(<PdfSummaryNavigationPreview/>);
