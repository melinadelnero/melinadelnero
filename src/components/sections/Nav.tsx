export default function Nav() {
  return (
    <nav className="nav">
      <a href="#top" style={{ fontFamily: 'var(--f-display)', fontSize: 14, letterSpacing: '-0.02em', textTransform: 'none' }}>
        <span style={{ fontWeight: 500 }}>MELINA</span>
        <em style={{ fontFamily: 'var(--f-serif)', fontStyle: 'italic', color: 'var(--accent)' }}>delnero</em>
      </a>
      <div className="nav-links">
        <a href="#bio">Bio</a>
        <a href="#events">Eventos</a>
        <a href="#sets">Sets</a>
        <a href="#gallery">Galería</a>
        <a href="#contact">Booking</a>
      </div>
      <div className="nav-status">
        <span className="dot" />
        <span>LIVE · BSAS</span>
      </div>
    </nav>
  )
}
