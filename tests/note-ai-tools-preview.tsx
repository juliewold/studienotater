import { createRoot } from 'react-dom/client';
import { NoteAITools } from '../src/components/notes/NoteAITools/NoteAITools';
window.fetch = async (input, options) => {
  if (!String(input).endsWith('/explain-selection/')) throw Error('Unexpected request');
  if (JSON.parse(String(options?.body)).text !== 'Forventning er et vektet gjennomsnitt.') throw Error('Wrong selection payload');
  await new Promise(resolve => setTimeout(resolve, 300));
  return Response.json({explanation:'Forventningen er gjennomsnittet når hver verdi vektes med sannsynligheten sin.'});
};
function selectExcerpt() {
  const range = document.createRange();range.selectNodeContents(document.getElementById('excerpt')!);
  const selection=window.getSelection()!;selection.removeAllRanges();selection.addRange(range);
  document.dispatchEvent(new Event('selectionchange'));
}
createRoot(document.getElementById('root')!).render(<>
  <button onClick={selectExcerpt}>Velg testutdrag</button>
  <NoteAITools noteId="test" subjectId="test" content="Forventning er et vektet gjennomsnitt.">
    <p id="excerpt">Forventning er et vektet gjennomsnitt.</p><p>Denne delen skal ikke sendes.</p>
  </NoteAITools>
</>);
