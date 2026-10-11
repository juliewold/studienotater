import "./Navbar.css";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, CalendarDays, ChevronDown, FileText, GraduationCap, House, Layers, Moon, PanelLeft, Search, Sun, Video, X } from "lucide-react";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import { supabase } from "../../../lib/supabase";
import { GlobalSearch } from "../../search/GlobalSearch/GlobalSearch";
import { useSemesterSubjects } from "../../../hooks/useSemesterSubjects";
import { useTheme } from "../../../hooks/useTheme";
import { subjects } from "../../../data/subjects";
import "../../subjects/SemesterSubjects/SemesterSubjects.css";

const mainLinks = [
  { to: "/", label: "Hjem", icon: House },
  { to: "/fagplan", label: "Fagplan", icon: GraduationCap },
  { to: "/notater", label: "Notater", icon: BookOpen },
  { to: "/flashcards", label: "Flashcards", icon: Layers },
  { to: "/videoer", label: "Videoer", icon: Video },
  { to: "/pdfs", label: "Forelesningsnotater", icon: FileText },
];

const SidebarContent = ({ onNavigate }: { onNavigate: () => void }) => {
  const { user, isAdmin } = useContext(AuthContext);
  const { semesterSubjects, isLoadingSemesterSubjects } = useSemesterSubjects();
  const link = (to: string, label: string) => <NavLink key={to} to={to} onClick={onNavigate} className="app-sidebar-link">{label}</NavLink>;
  return <>
    <Link to="/" className="app-brand" onClick={onNavigate}><span className="app-brand-mark"><BookOpen size={21} /></span>Studienotater</Link>
    <nav aria-label="Hovednavigasjon" className="sidebar-main">
      {mainLinks.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === "/"} onClick={onNavigate} className="app-sidebar-link"><Icon size={18} />{label}</NavLink>)}
    </nav>
    <section className="sidebar-subjects" aria-label="Mine fag">
      <div className="sidebar-section-title"><h2>Mine fag</h2><Link to="/semesterstart" aria-label="Administrer mine fag" onClick={onNavigate}>+</Link></div>
      {isLoadingSemesterSubjects ? <p className="sidebar-hint">Laster fag…</p> : semesterSubjects.length ? semesterSubjects.map(subject => {
        const regular = subjects.find(item => item.id === subject.subjectId);
        const code = subject.customCode ?? regular?.code ?? subject.subjectId.toUpperCase();
        const name = subject.customName ?? regular?.name ?? "";
        return <NavLink key={subject.subjectId} to={`/fag/${subject.subjectId}`} onClick={onNavigate} className={`app-sidebar-link sidebar-subject semester-subject-${regular?.color ?? "default"}`}>
          <span className="semester-subject-indicator" /><span><strong>{code}</strong><small>{name}</small></span>
        </NavLink>;
      }) : <Link className="sidebar-hint" to={user ? "/semesterstart" : "/logg-inn"} onClick={onNavigate}>{user ? "Velg fag for semesteret →" : "Logg inn for å se dine fag →"}</Link>}
    </section>
    <nav aria-label="Flere sider" className="sidebar-sections">
      <details><summary>Mine studier <ChevronDown size={16} /></summary>
        {link("/semesterstart", "Semesterstart")}{link("/klassetrinn", "Klassetrinn")}{link("/programmering", "Programmering")}{user && link("/FavoritesPage", "Favoritter")}
      </details>
      <details><summary>Planlegging <ChevronDown size={16} /></summary>
        {link("/kalender", "Kalender")}{link("/eksamen", "Eksamensnedtelling")}
      </details>
      <details><summary>Annet <ChevronDown size={16} /></summary>
        {link("/AboutPage", "Om nettsiden")}{link("/innstillinger", "Innstillinger")}
        {user ? link("/profil", "Min profil") : <>{link("/logg-inn", "Logg inn")}{link("/registrer", "Registrer deg")}</>}
        {isAdmin && link("/admin", "Administrasjon")}
      </details>
    </nav>
    <div className="sidebar-footer"><CalendarDays size={15} /><span>Litt læring, hver dag.</span></div>
  </>;
};

export const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, isLoading, signOut } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const { dark, toggleTheme } = useTheme();
  const drawer = useRef<HTMLDialogElement>(null);
  const account = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) return;
    supabase.from("profiles").select("username").eq("id", user.id).single().then(({ data }) => {
      if (!cancelled) setUsername(data?.username ?? "");
    });
    return () => { cancelled = true; };
  }, [user]);

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (account.current && !account.current.contains(event.target as Node)) account.current.open = false;
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && account.current?.open) {
        account.current.open = false;
        account.current.querySelector("summary")?.focus();
      }
    };
    const breakpoint = matchMedia("(min-width: 1101px)");
    const closeDrawer = () => { if (breakpoint.matches) drawer.current?.close(); };
    breakpoint.addEventListener("change", closeDrawer);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      breakpoint.removeEventListener("change", closeDrawer);
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  useEffect(() => {
    drawer.current?.close();
    if (account.current) account.current.open = false;
  }, [pathname]);

  const closeMenus = () => {
    drawer.current?.close();
    if (account.current) account.current.open = false;
  };
  const handleSignOut = async () => { await signOut(); setUsername(""); closeMenus(); navigate("/logg-inn"); };
  const displayName = username || user?.email?.split("@")[0] || "Profil";

  return <>
    <a href="#app-content" className="app-skip-link" onClick={event => { event.preventDefault(); document.getElementById("app-content")?.focus(); }}>Hopp til innhold</a>
    <aside className="app-sidebar"><SidebarContent onNavigate={closeMenus} /></aside>
    <dialog ref={drawer} className="app-nav-drawer" aria-label="Navigasjon" onClick={event => { if (event.target === event.currentTarget) drawer.current?.close(); }}>
      <div className="app-drawer-content"><button className="app-icon-button drawer-close" aria-label="Lukk navigasjon" onClick={() => drawer.current?.close()}><X size={20} /></button><SidebarContent onNavigate={closeMenus} /></div>
    </dialog>
    <header className="app-topbar">
      <div className="app-topbar-inner">
        <button className="app-icon-button sidebar-toggle" aria-label="Åpne navigasjon" aria-haspopup="dialog" onClick={() => drawer.current?.showModal()}><PanelLeft size={21} /></button>
        <div className="app-search"><Search size={18} aria-hidden="true" /><GlobalSearch onNavigate={closeMenus} /></div>
        <div className="app-topbar-actions">
          <button className="app-icon-button" aria-label={dark ? "Bruk lyst tema" : "Bruk mørkt tema"} aria-pressed={dark} onClick={toggleTheme}>{dark ? <Sun size={20} /> : <Moon size={20} />}</button>
          {isLoading ? <span>Laster…</span> : user ? <details className="app-account" ref={account}>
            <summary><span className="app-avatar">{displayName.slice(0, 1).toUpperCase()}</span><span className="account-name">{displayName}</span><ChevronDown size={14} /></summary>
            <div className="app-account-menu"><p>{user.email}</p><Link to="/profil" onClick={closeMenus}>Min profil</Link><Link to="/FavoritesPage" onClick={closeMenus}>Favoritter</Link><Link to="/innstillinger" onClick={closeMenus}>Innstillinger</Link><button onClick={handleSignOut}>Logg ut</button></div>
          </details> : <Link className="app-login" to="/logg-inn">Logg inn</Link>}
        </div>
      </div>
    </header>
  </>;
};
