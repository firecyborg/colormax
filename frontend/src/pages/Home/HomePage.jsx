import './HomePage.css'

export default function HomePage({ onAccount }) {
  return <div className="homepage">

  <header className="header">
    <a className="logo" href="./" aria-label="Colormax avaleht">
      <svg viewBox="0 0 100 100" aria-hidden="true"><path fill="#385f67" d="M8 24Q28 15 50 26V88Q29 76 8 84Z"/><path fill="#397f7c" d="M50 26Q71 15 92 24V84Q70 76 50 88Z"/><path fill="#309674" d="M62 9 76 21 51 61 38 51Z"/><path fill="#28c214" d="m38 51 13 10-7 12Z"/></svg>
    </a>
    <nav aria-label="Peamenüü"><a href="#konto" onClick={onAccount}>Konto sätted</a><a href="#uus-raamat" onClick={() => document.getElementById("book").showModal()}>Uus raamat</a></nav>
  </header>
  <main>
    <section className="hero" aria-labelledby="title">
      <p className="badge">Hind sõltub lehekülgede arvust</p>
      <h1 id="title">Loo ise värviraamat</h1>
      <p className="intro">Saad ise valida pilte paljudest erinevatest teemadest ning ka kombineerida neid</p>
      <div className="prices" aria-label="Hinnastamine"><p>X€ Baashind</p><p>Y€ Iga lisatud<br /> lehekülg</p></div>
      <button className="start" onClick={() => document.getElementById("book").showModal()}>Hakka koostama</button>
    </section>
    <aside className="account" aria-labelledby="account-title">
      <div><h2 id="account-title">Konto</h2><p>Vaata varasemaid tellimusi ja koostatud raamatuid</p></div>
      <button className="outline" onClick={onAccount}>Konto sätted</button>
    </aside>
  </main>
  <dialog id="book"><form method="dialog"><button className="close" aria-label="Sulge">×</button><h2>Uus värviraamat</h2><p>Raamatu koostamine lisandub peagi. Siin saad edaspidi valida teemad ja leheküljed.</p><button className="outline">Tagasi avalehele</button></form></dialog>
  
</div>
}
