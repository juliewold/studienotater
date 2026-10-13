import { folderToneClass } from "../../../services/notes/noteFolderOrder";
import "../FolderCard/folderColors.css";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Link, Outlet, useLocation, useMatch, useNavigate, useParams } from "react-router-dom";
import { ChevronDown, FileText, Folder, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { subjects } from "../../../data/subjects";
import { useSemesterSubjects } from "../../../hooks/useSemesterSubjects";
import { getNoteFoldersBySubject, type NoteFolder } from "../../../services/notes/noteFoldersService";
import { getNotesBySubject } from "../../../services/notes/notesService";
import { orderNotesForNavigation } from "../../../services/notes/noteOrder";
import type { DatabaseNote } from "../../../services/notes/notesService";
import { NOTES_CHANGED, prepareNotesNavigation } from "../../../services/notes/notesNavigationEvents";
import "./NotesLayout.css";

export const NotesLayout = () => {
  const { subjectId = "" } = useParams();
  return <SubjectNotesLayout key={subjectId} subjectId={subjectId} />;
};

const SubjectNotesLayout = ({ subjectId }: { subjectId: string }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const folderMatch = useMatch("/fag/:subjectId/notater/mappe/:folderId");
  const noteMatch = useMatch("/fag/:subjectId/notater/:noteId");
  const { semesterSubjects } = useSemesterSubjects();
  const subject = subjects.find(item => item.id === subjectId);
  const custom = semesterSubjects.find(item => item.subjectId === subjectId);
  const code = custom?.customCode ?? subject?.code ?? subjectId.toUpperCase();
  const name = custom?.customName ?? subject?.name ?? "Notater";
  const base = `/fag/${encodeURIComponent(subjectId)}/notater`;
  const [data, setData] = useState<{ folders: NoteFolder[]; notes: DatabaseNote[] }>({ folders: [], notes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [collapsed, setCollapsed] = useState(false);
  const [navigationMessage, setNavigationMessage] = useState("");
  const pendingNavigation = useRef(false);
  const drawer = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let cancelled = false;
    let request = 0;
    let timer: ReturnType<typeof setTimeout>;
    const load = async () => {
      const current = ++request;
      try {
        const [folders, notes] = await Promise.all([getNoteFoldersBySubject(subjectId), getNotesBySubject(subjectId)]);
        if (cancelled || current !== request) return;
        setData({ folders, notes: orderNotesForNavigation(notes, folders) });
        setError("");
      } catch {
        if (!cancelled && current === request) setError("Kunne ikke hente notatoversikten.");
      } finally {
        if (!cancelled && current === request) setLoading(false);
      }
    };
    const refresh = () => { clearTimeout(timer); timer = setTimeout(() => void load(), 150); };
    void load();
    window.addEventListener(NOTES_CHANGED, refresh);
    return () => { cancelled = true; clearTimeout(timer); window.removeEventListener(NOTES_CHANGED, refresh); };
  }, [subjectId, pathname, retry]);

  useEffect(() => {
    drawer.current?.close();
    const breakpoint = matchMedia("(min-width: 901px)");
    const close = () => { if (breakpoint.matches) drawer.current?.close(); };
    breakpoint.addEventListener("change", close);
    return () => breakpoint.removeEventListener("change", close);
  }, [pathname]);

  const currentNote = data.notes.find(note => note.slug === noteMatch?.params.noteId);
  const currentFolder = folderMatch?.params.folderId ?? currentNote?.folderId;
  const go = async (event: MouseEvent<HTMLAnchorElement>, to: string, folderId?: string | null) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (pendingNavigation.current) return;
    pendingNavigation.current = true;
    setNavigationMessage("Lagrer eventuelle endringer…");
    try {
      if (!(await prepareNotesNavigation())) {
        setNavigationMessage("Notatet kunne ikke lagres. Rett feilen i redigeringen før du bytter notat.");
        return;
      }
      if (folderId) setExpanded(previous => ({ ...previous, [folderId]: true }));
      setNavigationMessage("");
      drawer.current?.close();
      navigate(to);
    } finally { pendingNavigation.current = false; }
  };
  const noteLink = (note: DatabaseNote) => <Link key={note.id} to={`${base}/${encodeURIComponent(note.slug)}`} onClick={event => void go(event, `${base}/${encodeURIComponent(note.slug)}`, note.folderId)} className={`notes-outline-note${currentNote?.id === note.id ? " is-current" : ""}`} aria-current={currentNote?.id === note.id ? "page" : undefined}><FileText size={14} /><span>{note.title}</span></Link>;
  const unfiled = data.notes.filter(note => !note.folderId || !data.folders.some(folder => folder.id === note.folderId));
  const outline = <>
    <header className="notes-outline-header"><div><span>{code}</span><h2>{name}</h2></div></header>
    <Link className="notes-outline-all" to={base} onClick={event => void go(event, base)} aria-current={pathname === base ? "page" : undefined}>Alle notater</Link>
    {loading && <p className="notes-outline-status">Laster mapper og notater…</p>}
    {error && <div className="notes-outline-status" role="alert">{error} <button onClick={() => setRetry(value => value + 1)}>Prøv igjen</button></div>}
    <nav aria-label={`Mapper og notater i ${code}`}>
      {data.folders.map((folder) => {
        const notes = data.notes.filter(note => note.folderId === folder.id);
        const active = currentFolder === folder.id;
        const open = expanded[folder.id] ?? active;
        return <section key={folder.id} className={`notes-outline-folder ${folderToneClass(folder)}${active ? " is-current-folder" : ""}`}>
          <div className="notes-outline-folder-heading"><button aria-label={`${open ? "Skjul" : "Vis"} notater i ${folder.name}`} aria-expanded={open} onClick={() => setExpanded(previous => ({ ...previous, [folder.id]: !open }))}><ChevronDown size={16} /></button><Link to={`${base}/mappe/${encodeURIComponent(folder.id)}`} onClick={event => void go(event, `${base}/mappe/${encodeURIComponent(folder.id)}`, folder.id)} aria-current={folderMatch?.params.folderId === folder.id ? "page" : undefined}><Folder size={16} /><span>{folder.name}</span><small>{notes.length}</small></Link></div>
          {open && <div className="notes-outline-children">{notes.length ? notes.map(noteLink) : <p className="notes-outline-status">Ingen notater i mappen.</p>}</div>}
        </section>;
      })}
      {unfiled.length > 0 && <section className="notes-outline-unfiled"><h3>Uten mappe</h3>{unfiled.map(noteLink)}</section>}
      {!loading && !error && !data.folders.length && !data.notes.length && <p className="notes-outline-status">Ingen mapper eller notater ennå.</p>}
    </nav>
    {navigationMessage && <p className="notes-outline-status" role="status">{navigationMessage}</p>}
  </>;

  return <div className={`notes-workspace${collapsed ? " notes-workspace-collapsed" : ""}`}>
    <aside className="notes-outline-desktop" aria-label="Notatnavigasjon"><button className="notes-outline-toggle" aria-label={collapsed ? "Vis notatsidebar" : "Skjul notatsidebar"} aria-expanded={!collapsed} onClick={() => setCollapsed(value => !value)}>{collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}{!collapsed && <span>Notater</span>}</button>{!collapsed && outline}</aside>
    <div className="notes-workspace-content"><button className="notes-outline-mobile-toggle" onClick={() => drawer.current?.showModal()} aria-haspopup="dialog"><PanelLeftOpen size={18} />Mapper og notater</button><Outlet /></div>
    <dialog ref={drawer} className="notes-outline-drawer" aria-label="Mapper og notater"><button className="notes-outline-toggle" aria-label="Lukk notatsidebar" onClick={() => drawer.current?.close()}><X size={20} />Lukk</button>{outline}</dialog>
  </div>;
};
