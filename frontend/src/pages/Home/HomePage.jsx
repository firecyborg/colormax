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
      <p className="eyebrow">SINU IDEED. SINU VÄRVID.</p>
      <p className="badge">Hind sõltub lehekülgede arvust</p>
      <h1 id="title">Loo ise värviraamat</h1>
      <p className="intro">Saad ise valida pilte paljudest erinevatest teemadest ning ka kombineerida neid</p>
      <div className="prices" aria-label="Hinnastamine"><p><strong>X€</strong><span>Baashind</span></p><p><strong>Y€</strong><span>Iga lisatud lehekülg</span></p></div>
      <button className="start" onClick={openBook}>Hakka koostama <span aria-hidden="true">→</span></button>
    </section>
    <aside className="account" aria-labelledby="account-title">
      <div className="book-scene" aria-hidden="true">
        <span className="scene-spark spark-one">✦</span><span className="scene-spark spark-two">✧</span>
        <div className="sample-book"><span className="book-caption">MINU VÄRVIMAAILM</span>
          <svg viewBox="0 0 200 180" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path fill="#eaf5e4" d="M30 145Q12 104 44 83Q23 42 64 39Q79 8 103 35Q144 12 153 54Q188 54 170 91Q197 122 165 145Z" />
            <path d="M100 151V76m0 35L64 80m36 13 29-26m-29 62 42-23M48 151h108" />
            <path fill="#fff" d="M45 151v-29l16-14 16 14v29m-23 0v-18h13v18" />
            <path fill="#fff0bd" d="m136 137 7-14 7 14 15 2-11 11 3 15-14-7-14 7 3-15-11-11Z" />
            <circle cx="48" cy="60" r="7" fill="#d9edcf"/><path d="m157 29 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" />
          </svg>
          <span className="book-footer">Iga leht on sinu moodi</span>
        </div>
        <div className="scene-pencil" /><span className="scene-label">Natuke kujutlust, palju värve.</span>
      </div>
      <div className="account-content"><h2 id="account-title">Konto</h2><p>Vaata varasemaid tellimusi ja koostatud raamatuid</p></div>
      <button className="outline" onClick={onAccount}>Konto sätted</button>
    </aside>
    <section className="how-it-works" aria-labelledby="how-title">
      <div className="steps-heading"><p className="eyebrow">IDEEDEST OMA RAAMATUNI</p><h2 id="how-title">Sinu värviraamat, kolmes sammus</h2></div>
      <ol className="creation-steps">
        <li><span className="step-number">01</span><div><h3>Vali oma lemmikud</h3><p>Leia pildid teemadest, mis sind kõnetavad.</p></div></li>
        <li><span className="step-number">02</span><div><h3>Pane raamat kokku</h3><p>Kombineeri teemasid ja vali lehekülgede arv.</p></div></li>
        <li><span className="step-number">03</span><div><h3>Lase värvid valla</h3><p>Loo raamat, mida on rõõm värvida.</p></div></li>
      </ol>
    </section>
  </main>
  <dialog ref={bookDialog} id="book"><form method="dialog"><button className="close" aria-label="Sulge">×</button><h2>Uus värviraamat</h2><p>Raamatu koostamine lisandub peagi. Siin saad edaspidi valida teemad ja leheküljed.</p><button className="outline">Tagasi avalehele</button></form></dialog>
  
</div>
}
