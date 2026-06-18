export const Navbar = () => {
  return (
    <header className="navbar">
      <a href="#" className="logo">
        Studienotater
      </a>
      <nav className="nav-links">
        <a href="#">Hjem</a>
        <a href="#">Fag</a>
        <a href="#">Notater</a>
        <a href="#">Flashcards</a>
      </nav>

      <button className="menu-button">☰</button>
    </header>
  );
};
