import { useEffect, useRef, useState } from 'react'
import Logo from '../shared/components/Logo.jsx'
import './BookPage.css'

const money = (cents) => new Intl.NumberFormat('et-EE', { style: 'currency', currency: 'EUR' }).format(cents / 100)
const imageUrl = (page) => `/api/images/${page.file_path.split('/').map(encodeURIComponent).join('/')}`

export default function BookPage({ onHome, onAccount }) {
  const [pages, setPages] = useState([])
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('all')
  const [selected, setSelected] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const preview = useRef(null)
  const order = useRef(null)

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      setLoading(true)
      setError('')
      try {
        const results = await Promise.all(['/api/pages', '/api/categories'].map(async (url) => {
          const response = await fetch(url, { signal: controller.signal })
          if (!response.ok) throw new Error('Pildikogu laadimine ebaõnnestus.')
          const data = await response.json()
          if (!Array.isArray(data)) throw new Error('Pildikogu vastus ei ole korrektne.')
          return data
        }))
        setPages(results[0]); setCategories(results[1])
      } catch (err) {
        if (err.name !== 'AbortError') setError('Pildikogu ei ole praegu kättesaadav. Kontrolli, et backend töötab, ja proovi uuesti.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [attempt])

  function toggle(page) {
    setSelected((items) => items.some((item) => item.id === page.id) ? items.filter((item) => item.id !== page.id) : [...items, page])
  }
  function move(index, direction) {
    setSelected((items) => {
      const next = [...items]
      const destination = index + direction
      if (destination < 0 || destination >= next.length) return items
      ;[next[index], next[destination]] = [next[destination], next[index]]
      return next
    })
  }
  const visible = pages.filter((page) => category === 'all' || String(page.category_id) === category)
  const total = 800 + selected.length * 45

  return <div className="book-page">
    <header className="book-header"><button className="book-logo" onClick={onHome} aria-label="Avaleht"><Logo /></button><nav aria-label="Peamenüü"><button onClick={onHome}>Avaleht</button><button aria-current="page">Uus raamat</button><button onClick={onAccount}>Konto sätted</button></nav></header>
    <main className="book-main">
      <div className="book-heading"><p className="book-eyebrow">SINU IDEED. SINU VÄRVID.</p><h1>Koosta oma värviraamat</h1><p>Vali pildid, sea need järjekorda ja vaata eelvaadet. Hind arvutatakse lehekülgede arvu järgi.</p><ol className="book-steps"><li>1 · Vali pildid</li><li>2 · Sea järjekord</li><li>3 · Telli</li></ol></div>
      <div className="book-layout">
        <section className="book-library book-card" aria-labelledby="library-title"><h2 id="library-title">Pildikogu</h2>
          <div className="book-filters" aria-label="Kategooriad"><button aria-pressed={category === 'all'} onClick={() => setCategory('all')}>Kõik</button>{categories.map((item) => <button key={item.id ?? item.ID} aria-pressed={category === String(item.id ?? item.ID)} onClick={() => setCategory(String(item.id ?? item.ID))}>{item.name}</button>)}</div>
          {loading ? <p role="status">Laadin pildikogu…</p> : error ? <div role="alert"><p>{error}</p><button className="book-outline" onClick={() => setAttempt(attempt + 1)}>Proovi uuesti</button></div> : !visible.length ? <p>Selles kategoorias pole veel pilte.</p> : <div className="book-grid">{visible.map((page) => {
            const added = selected.some((item) => item.id === page.id)
            return <article className="picture-card" key={page.id}><img src={imageUrl(page)} alt={page.title} loading="lazy" /><div className="picture-caption"><h3>{page.title}</h3><span>{page.category}</span></div><button className={added ? 'is-added' : ''} aria-pressed={added} onClick={() => toggle(page)}>{added ? 'Lisatud · eemalda' : '+ Lisa raamatusse'}</button></article>
          })}</div>}
        </section>
        <aside className="book-sidebar">
          <section className="book-card"><div className="book-summary-heading"><h2>Sinu raamat</h2><span aria-live="polite">{selected.length} lk</span></div><label className="book-title-label" htmlFor="book-cover-title">Kaane pealkiri</label><input id="book-cover-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Näiteks: Loomad kosmoses" maxLength={100} />
            {!selected.length && <div className="book-empty"><span aria-hidden="true">＋</span><h3>Sinu lugu algab siit</h3><p>Lisa pildikogust oma lemmikud. Need ilmuvad siia sinu valitud järjekorras.</p></div>}
            <ol className="selected-pages">{selected.map((page, index) => <li key={page.id}><span>{index + 1}</span><img src={imageUrl(page)} alt="" /><strong>{page.title}</strong><button disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Liiguta ${page.title} üles`}>↑</button><button disabled={index === selected.length - 1} onClick={() => move(index, 1)} aria-label={`Liiguta ${page.title} alla`}>↓</button><button className="remove-page" onClick={() => toggle(page)} aria-label={`Eemalda ${page.title}`}>×</button></li>)}</ol>
            <button className="book-outline" disabled={!selected.length} onClick={() => preview.current.showModal()}>Vaata eelvaadet</button>
          </section>
          <section className="book-pricing" aria-labelledby="price-title"><h2 id="price-title">Hinnakokkuvõte</h2><dl><div><dt>Lehekülgi</dt><dd>{selected.length}</dd></div><div><dt>Alushind</dt><dd>{money(800)}</dd></div><div><dt>{selected.length} lk × {money(45)}</dt><dd>{money(selected.length * 45)}</dd></div><div className="book-total"><dt>Hind kokku</dt><dd>{money(total)}</dd></div></dl><button className="book-primary" disabled={!selected.length} onClick={() => order.current.showModal()}>Telli raamat <span aria-hidden="true">→</span></button><p className="book-price-note">Näidishinnad · tellimuse vormistamine lisandub peagi</p></section>
        </aside>
      </div>
    </main>
    <dialog className="book-dialog" ref={preview}><form method="dialog"><button className="dialog-close" aria-label="Sulge eelvaade">×</button></form><h2>{title.trim() || 'Minu värviraamat'}</h2><p>{selected.length} lehekülge · {money(total)}</p><div className="preview-pages">{selected.map((page, index) => <figure key={page.id}><img src={imageUrl(page)} alt={page.title} /><figcaption>{index + 1}. {page.title}</figcaption></figure>)}</div></dialog>
    <dialog className="book-dialog" ref={order}><h2>Sinu raamat on kokku pandud!</h2><p>Valisid {selected.length} lehekülge. Tellimuse vormistamine ja maksmine pole veel saadaval. Sinu valik säilib selles vaates.</p><form method="dialog"><button className="book-outline">Tagasi koostama</button></form></dialog>
  </div>
}
