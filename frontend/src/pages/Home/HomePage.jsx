import { useRef } from 'react'
import Logo from '../shared/components/Logo.jsx'
import './HomePage.css'

export default function HomePage({ onAccount }) {
  const bookDialog = useRef(null)
  const openBook = () => bookDialog.current.showModal()

  return <div className="homepage">

  <header className="header">
    <a className="logo" href="./" aria-label="Colormax avaleht">
      <Logo />
    </a>
    <nav aria-label="Peamenüü"><button onClick={onAccount}>Konto sätted</button><button className="nav-create" onClick={openBook}>Uus raamat <span aria-hidden="true">＋</span></button></nav>
  </header>
  <main>
    <section className="hero" aria-labelledby="title">
      <p className="badge">Hind sõltub lehekülgede arvust</p>
      <h1 id="title">Loo ise värviraamat</h1>
      <p className="intro">Saad ise valida pilte paljudest erinevatest teemadest ning ka kombineerida neid</p>
      <div className="prices" aria-label="Hinnastamine"><p><strong>X€</strong><span>Baashind</span></p><p><strong>Y€</strong><span>Iga lisatud lehekülg</span></p></div>
      <button className="start" onClick={openBook}>Hakka koostama <span aria-hidden="true">→</span></button>
    </section>
    <aside className="account" aria-labelledby="account-title">
      <div><span className="account-symbol" aria-hidden="true">♧</span><h2 id="account-title">Konto</h2><p>Vaata varasemaid tellimusi ja koostatud raamatuid</p></div>
      <button className="outline" onClick={onAccount}>Konto sätted</button>
    </aside>
  </main>
  <dialog ref={bookDialog} id="book"><form method="dialog"><button className="close" aria-label="Sulge">×</button><h2>Uus värviraamat</h2><p>Raamatu koostamine lisandub peagi. Siin saad edaspidi valida teemad ja leheküljed.</p><button className="outline">Tagasi avalehele</button></form></dialog>
  
</div>
}
