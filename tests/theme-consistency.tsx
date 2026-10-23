import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { ReadOnlyNote } from '../src/components/notes/ReadOnlyNote/ReadOnlyNote';
import { PdfSummaryModal } from '../src/components/media/PdfSummaryModal/PdfSummaryModal';
import '../src/App';
import '../src/index.css';
import '../src/styles/global.css';
import '../src/styles/containers.css';
import '../src/styles/theme.css';
// Fixture uses real components/styles, without authentication or writes to study data.
window.fetch = async () => Response.json([]);
const content = '<h2>Forventning</h2><p>En vanlig forklaring med <strong>uthevet tekst</strong> og matematikk <span data-type="inline-math" data-latex="E[X]"></span>.</p><div data-type="callout" data-callout-type="definition"><div class="note-callout-body"><p>Forventningsverdien er et vektet gjennomsnitt.</p></div></div>';
export function Preview() {
  const [dark, setDark] = useState(false);
  const [pdf, setPdf] = useState(false);
  const [page,setPage] = useState('Oppgaver');
  const [report,setReport] = useState('');
  function theme(value:boolean) { document.documentElement.dataset.theme=value?'dark':'light';setDark(value); }
  async function run() {
    const original=document.documentElement.dataset.theme;
    const rows:string[]=[];
    const selectors=['.practice-section','.question-section','.answer-option','.profile-summary','.profile-summary span','.calendar-day','.calendar-toolbar','.calendar-event-detail-row','.pdf-summary-modal','.pdf-summary-modal-close','.practice-summary','.number-answer-wrapper input','.answer-feedback-correct','.answer-feedback-wrong'];
    const event=document.querySelector('.calendar-subject-pink')!;
    document.documentElement.dataset.theme='light';
    await new Promise(resolve=>setTimeout(resolve,350));
    const eventLight=getComputedStyle(event).backgroundColor;
    const light=selectors.map(s=>getComputedStyle(document.querySelector(s)!).backgroundColor);
    document.documentElement.dataset.theme='dark';
    await new Promise(resolve=>setTimeout(resolve,350));
    for(const selector of selectors) {
      const el=document.querySelector(selector)!;const style=getComputedStyle(el);
      if(luminance(style.backgroundColor)>.12)throw Error(`${selector}: light surface in dark theme`);
      if(contrast(style.color,style.backgroundColor)<4.5)throw Error(`${selector}: low text contrast`);
      rows.push(selector);
    }
    for(const selector of ['.question-counter','.profile-help','.calendar-week-time-label']) {
      const style=getComputedStyle(document.querySelector(selector)!);
      if(contrast(style.color,getComputedStyle(document.documentElement).getPropertyValue('--app-surface').trim())<4.5)throw Error(`${selector}: low muted contrast`);
    }
    if(getComputedStyle(event).backgroundColor!==eventLight)throw Error('Subject color changed');
    document.documentElement.dataset.theme='light';
    await new Promise(resolve=>setTimeout(resolve,350));
    selectors.forEach((s,i)=>{if(getComputedStyle(document.querySelector(s)!).backgroundColor!==light[i])throw Error('Light color not restored');});
    document.documentElement.dataset.theme=original||'light';
    setReport(`${rows.length+5} kontrast-/tematester bestått`);
  }
  return <main className="page-container" style={{paddingBlock:24}}>
    <h1>Temakontroll</h1><button onClick={()=>theme(!dark)}>{dark?'Light mode':'Dark mode'}</button>{' '}
    <button onClick={()=>setPdf(true)}>Åpne PDF-oppsummering</button>{' '}
    <button onClick={()=>run().catch(e=>setReport(String(e)))}>Kjør kontrasttester</button><p role="status">{report}</p>
    <nav>{['Oppgaver','Profil','Kalender','Notat'].map(name=><button key={name} onClick={()=>setPage(name)}>{name}</button>)}</nav>
    <div hidden={page!=='Oppgaver'} className="practice-page">
      <div hidden className="practice-summary">Øvingsoversikt</div>
      <div className="practice-section"><h2>Velg temaer</h2><p className="selection-count">2 temaer valgt</p><div className="topics-grid"><label className="topic-card topic-card-selected">Sannsynlighet</label><label className="topic-card">Fordelinger</label></div></div>
      <section className="question-section"><header className="question-header"><span className="question-counter">Oppgave 1 av 10</span></header><h1>Hva er forventningsverdien?</h1><div className="answer-options"><label className="answer-option"><input type="radio" name="answer"/>Summen av verdier vektet med sannsynlighet</label><label className="answer-option answer-option-selected"><input type="radio" name="answer" defaultChecked/>Det største utfallet</label></div><div className="answer-feedback answer-feedback-correct">Riktig svar – se forklaringen.</div><div className="answer-feedback answer-feedback-wrong">Prøv igjen – bruk definisjonen.</div><div className="number-answer-wrapper"><label>Svar</label><input placeholder="Skriv svaret" /></div></section>
    </div>
    <div hidden={page!=='Profil'} className="profile-page"><div className="profile-card"><h1>Profil</h1><div className="profile-summary"><div><h2>Eksempelstudent</h2><p>student@example.test</p><span>Student</span></div></div><form className="profile-form" onSubmit={e=>e.preventDefault()}><label>Navn</label><input defaultValue="Eksempelstudent"/><p className="profile-help">Navnet vises på profilen din.</p><button>Lagre endringer</button></form></div></div>
    <div hidden={page!=='Kalender'} className="calendar-page"><div className="calendar-card"><div className="calendar-toolbar"><h2>Oktober 2026</h2><button className="calendar-navigation-button">Forrige</button><button className="calendar-view-button">Uke</button></div><div className="calendar-day"><div className="calendar-day-number">23</div><button className="calendar-event calendar-subject-pink"><span className="calendar-event-subject">TMA4240</span><strong>Forelesning</strong><span className="calendar-event-type">Undervisning</span></button></div><div className="calendar-week-time-label">10:00</div></div><div className="calendar-event-detail-row"><span>Sted</span><strong>Auditorium</strong></div></div>
    <div hidden={page!=='Notat'}><ReadOnlyNote content={content}/></div>
    <PdfSummaryModal isOpen={pdf} onClose={()=>setPdf(false)}><ReadOnlyNote content={content}/></PdfSummaryModal>
    {!pdf&&<div hidden><div className="pdf-summary-modal">Oppsummering<button className="pdf-summary-modal-close">Lukk</button></div></div>}
  </main>;
}
function luminance(color:string) {
  const rgb=color.startsWith('#')?color.slice(1).match(/../g)!.map(v=>parseInt(v,16)):color.match(/[\d.]+/g)!.slice(0,3).map(Number);
  const c=rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});return c[0]*.2126+c[1]*.7152+c[2]*.0722;
}
function contrast(a:string,b:string){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
createRoot(document.getElementById('root')!).render(<MemoryRouter><Preview/></MemoryRouter>);
