import { useEffect, useRef, useState } from 'react'
import { registerOrder } from '../../api/order.js'
import { saveBook } from '../../api/book.js'
import Logo from '../shared/components/Logo.jsx'
import CheckoutPage from '../Checkout/CheckoutPage.jsx'
import { BASE_PRICE, PAGE_PRICE, money } from '../shared/prices.js'
import './BookPage.css'

const imageUrl = (page) => `/api/images/${page.file_path.split('/').map(encodeURIComponent).join('/')}`
const DRAFT_KEY = "draftBook"

function readDraft() {
  try {
    return JSON.parse(sessionStorage.getItem(DRAFT_KEY))
  } catch {
    return null
  }
}

export default function BookPage({ onHome, onAccount, account, onLogin }) {
  const [draft] = useState(readDraft)
  const [pages, setPages] = useState([])
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('all')
  const [selected, setSelected] = useState(draft?.selected ?? [])
  const [title, setTitle] = useState(draft?.title ?? "")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [checkout, setCheckout] = useState(Boolean(account && draft?.toCheckout))
  const [previewStep, setPreviewStep] = useState(false)
  const [saving, setSaving] = useState(false)
  const [previewPage, setPreviewPage] = useState(0)
  const preview = useRef(null)
  const submittingOrder = useRef(false)
  const [savedBook, setSavedBook] = useState(null)

  useEffect(() => {
  sessionStorage.removeItem(DRAFT_KEY)
  }, [])
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

  function goToCheckout() {
    if (!account) {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ title, selected, toCheckout: true }))
      onLogin()
      return
    }
    setCheckout(true)
  }

  async function handleSaveBook() {
    if (!account) {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ title, selected, toCheckout: false }))
      onLogin()
      return
    }

    setSaving(true)
    try {
      const book = await saveBook(title, selected.map((page) => page.id))
      setSavedBook(book)
      window.alert(`Raamat „${book.title}” on salvestatud.`)
    } catch (error) {
      window.alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleRegisterOrder(orderDetails) {
    if (submittingOrder.current) return

    submittingOrder.current = true
    try {
      const order = await registerOrder(orderDetails)
      window.alert(`Tellimus nr ${order.id} on salvestatud.`)
      onHome()
    } catch (error) {
      window.alert(error.message)
    } finally {
      submittingOrder.current = false
    }
  }

  const visible = pages.filter((page) => category === 'all' || String(page.category_id) === category)
  const total = BASE_PRICE + selected.length * PAGE_PRICE
  const bookTitle = title.trim() || 'Minu värviraamat'
  const matchesSavedBook = savedBook !== null
    && savedBook.title === bookTitle
    && savedBook.pages.length === selected.length
    && selected.every((page, index) => page.id === savedBook.pages[index])
  const savedBookId = matchesSavedBook ? savedBook.id : null

  if (checkout) return <CheckoutPage
    title={title}
    pages={selected}
    onHome={onHome}
    onPages={() => { setCheckout(false); setPreviewStep(false) }}
    onPreview={() => { setCheckout(false); setPreviewStep(true) }}
    savedBookId={savedBookId}
    onSubmit={handleRegisterOrder}
  />

  if (previewStep) return <div className="book-page preview-step-page">
    <header className="book-header"><button className="book-logo" onClick={() => setPreviewStep(false)} aria-label="Tagasi lehekülgi valima"><Logo /></button><nav aria-label="Tellimuse sammud"><button onClick={() => setPreviewStep(false)}>Tagasi kujunduse juurde</button><strong>1. Leheküljed</strong><span aria-current="step">2. Eelvaade</span><span>3. Maksmine</span></nav></header>
    <main className="preview-step-main"><div className="checkout-heading"><h1>Vaata oma värviraamatut</h1><p>Kontrolli pilte ja järjekorda enne tellimuse vormistamist.</p></div>
      {!selected.length ? <section className="preview-empty book-card"><span aria-hidden="true">＋</span><h2>Sinu raamat ootab pilte</h2><p>Vali pildikogust mõned leheküljed, siis saad oma raamatut eelvaates sirvida.</p><button className="book-primary" onClick={() => setPreviewStep(false)}>Lisa pilte</button></section> : <div className="preview-step-layout">
        <section className="book-preview-stage" aria-label="Raamatu eelvaade">
          <div className="preview-book">
            <div className="preview-book-spread">
              <article className="preview-book-page preview-left-page">
                <span className="preview-page-number">{previewPage + 1}</span>
                <img src={imageUrl(selected[previewPage])} alt={selected[previewPage].title} />
                <strong>{selected[previewPage].title}</strong>
              </article>
              <article className="preview-book-page preview-right-page">
                {selected[previewPage + 1] ? (
                  <>
                    <span className="preview-page-number">{previewPage + 2}</span>
                    <img src={imageUrl(selected[previewPage + 1])} alt={selected[previewPage + 1].title} />
                    <strong>{selected[previewPage + 1].title}</strong>
                  </>
                ) : (
                  <div className="preview-last-page">
                    <Logo />
                    <strong>{title.trim() || 'Minu värviraamat'}</strong>
                    <span>Siin algavad sinu lood</span>
                  </div>
                )}
              </article>
            </div>
          </div>

          <div className="preview-controls">
            <button type="button" className="book-outline" disabled={previewPage === 0} onClick={() => setPreviewPage(Math.max(0, previewPage - 2))}>
              ← Eelmised lehed
            </button>
            <span aria-live="polite">
              {previewPage + 1}–{Math.min(previewPage + 2, selected.length)} / {selected.length}
            </span>
            <button type="button" className="book-outline" disabled={previewPage + 2 >= selected.length} onClick={() => setPreviewPage(Math.min(selected.length - 1, previewPage + 2))}>
              Järgmised lehed →
            </button>
          </div>

          <div className="preview-thumbnails" aria-label="Valitud leheküljed">
            {selected.map((page, index) => (
              <button
                type="button"
                key={page.id}
                aria-label={`Ava lehekülg ${index + 1}: ${page.title}`}
                aria-current={index === previewPage || index === previewPage + 1 ? 'page' : undefined}
                onClick={() => setPreviewPage(index % 2 === 0 ? index : index - 1)}
              >
                <img src={imageUrl(page)} alt="" />
                <span>{index + 1}</span>
              </button>
            ))}
          </div>
        </section>
        <aside className="preview-order-card"><h2>Sinu raamat</h2><div className="preview-cover"><Logo /><strong>{bookTitle}</strong><span>{selected.length} värvimislehekülge</span></div><dl><div><dt>Lehekülgi</dt><dd>{selected.length}</dd></div><div><dt>Raamatu hind</dt><dd>{money(total)}</dd></div></dl><button type="button" className="book-outline" onClick={() => setPreviewStep(false)}>Muuda pilte</button>
          <button type="button" className="book-primary" disabled={saving} onClick={goToCheckout}>
            Jätka tellimusega <span aria-hidden="true">→</span>
          </button>
        </aside>
      </div>}
    </main>
  </div>

  return <div className="book-page">
    <header className="book-header"><button className="book-logo" onClick={onHome} aria-label="Avaleht"><Logo /></button><nav aria-label="Peamenüü"><button onClick={onHome}>Avaleht</button><button aria-current="page">Uus raamat</button><button onClick={onAccount}>Konto sätted</button></nav></header>
    <main className="book-main">
      <div className="book-heading"><p className="book-eyebrow">SINU IDEED. SINU VÄRVID.</p><h1>Koosta oma värviraamat</h1><p>Vali pildid, sea need järjekorda ja vaata eelvaadet. Hind arvutatakse lehekülgede arvu järgi.</p><ol className="book-steps"><li>1 · Leheküljed</li><li>2 · Eelvaade</li><li>3 · Maksmine</li></ol></div>
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
            <button className="book-outline" disabled={!selected.length} onClick={() => { setPreviewPage(0); setPreviewStep(true) }}>Vaata eelvaadet</button>
            <button className="book-outline" disabled={!selected.length || saving} onClick={handleSaveBook}>
              {saving ? 'Salvestan…' : 'Salvesta raamat'}
            </button>
          </section>
          <section className="book-pricing" aria-labelledby="price-title"><h2 id="price-title">Hinnakokkuvõte</h2><dl><div><dt>Lehekülgi</dt><dd>{selected.length}</dd></div><div><dt>Alushind</dt><dd>{money(BASE_PRICE)}</dd></div><div><dt>{selected.length} lk × {money(PAGE_PRICE)}</dt><dd>{money(selected.length * PAGE_PRICE)}</dd></div><div className="book-total"><dt>Hind kokku</dt><dd>{money(total)}</dd></div></dl><button className="book-primary" disabled={!selected.length} onClick={() => { setPreviewPage(0); setPreviewStep(true) }}>Vaata eelvaadet <span aria-hidden="true">→</span></button><p className="book-price-note">Hind sisaldab raamatu koostamist</p></section>
        </aside>
      </div>
    </main>
    <dialog className="book-dialog" ref={preview}><form method="dialog"><button className="dialog-close" aria-label="Sulge eelvaade">×</button></form><h2>{title.trim() || 'Minu värviraamat'}</h2><p>{selected.length} lehekülge · {money(total)}</p><div className="preview-pages">{selected.map((page, index) => <figure key={page.id}><img src={imageUrl(page)} alt={page.title} /><figcaption>{index + 1}. {page.title}</figcaption></figure>)}</div></dialog>
  </div>
}
