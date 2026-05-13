export default function Footer() {
  return (
    <footer className="footer">
      <div className="word">
        MELINA<br /><em>delnero</em>
      </div>
      <div className="footer-col">
        <h4>Navegación</h4>
        <a href="#bio">Bio</a>
        <a href="#events">Eventos</a>
        <a href="#sets">Sets</a>
        <a href="#gallery">Galería</a>
        <a href="#contact">Booking</a>
      </div>
      <div className="footer-col">
        <h4>Social</h4>
        <a href="https://instagram.com/melinadelnero" target="_blank" rel="noreferrer">Instagram</a>
        <a href="https://soundcloud.com/melinadelnero" target="_blank" rel="noreferrer">SoundCloud</a>
        <a href="https://youtube.com/@melinadelnero" target="_blank" rel="noreferrer">YouTube</a>
      </div>
      <div className="footer-col">
        <h4>Contacto</h4>
        <a href="mailto:booking@melinadelnero.com">booking@…</a>
        <a href="mailto:press@melinadelnero.com">press@…</a>
        <a href="/admin" style={{ color: 'var(--ink-dim)', fontSize: 15 }}>Admin →</a>
      </div>
      <div className="footer-legal">
        <span>© {new Date().getFullYear()} MELINA DELNERO · ALL RIGHTS RESERVED</span>
        <span>BUENOS AIRES — AR</span>
        <span>SITE V1.0 · CRAFTED IN BSAS</span>
      </div>
    </footer>
  )
}
