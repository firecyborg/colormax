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
  const [checkout, setCheckout] = useState(false)
  const [previewStep, setPreviewStep] = useState(false)
  const [previewPage, setPreviewPage] = useState(0)
  const [delivery, setDelivery] = useState('standard')
  const [payment, setPayment] = useState('card')
  const [customer, setCustomer] = useState({ name: '', email: '', address: '' })
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
  const deliveryPrice = delivery === 'courier' ? 3900 : delivery === 'worldwide' ? 1000000 : 290
  const grandTotal = total + deliveryPrice
  const updateCustomer = (event) => setCustomer({ ...customer, [event.target.name]: event.target.value })

  if (previewStep) return <div className="book-page preview-step-page">
    <header className="book-header"><button className="book-logo" onClick={() => setPreviewStep(false)} aria-label="Tagasi lehekülgi valima"><Logo /></button><nav aria-label="Tellimuse sammud"><button onClick={() => setPreviewStep(false)}>Tagasi kujunduse juurde</button><strong>1. Leheküljed</strong><span aria-current="step">2. Eelvaade</span><span>3. Maksmine</span></nav></header>
    <main className="preview-step-main"><div className="checkout-heading"><h1>Vaata oma värviraamatut</h1><p>Kontrolli pilte ja järjekorda enne tellimuse vormistamist.</p></div>
      {!selected.length ? <section className="preview-empty book-card"><span aria-hidden="true">＋</span><h2>Sinu raamat ootab pilte</h2><p>Vali pildikogust mõned leheküljed, siis saad oma raamatut eelvaates sirvida.</p><button className="book-primary" onClick={() => setPreviewStep(false)}>Lisa pilte</button></section> : <div className="preview-step-layout">
        <section className="book-preview-stage" aria-label="Raamatu eelvaade"><div className="preview-book"><div className="preview-book-spread"><article className="preview-book-page preview-left-page"><span className="preview-page-number">{previewPage + 1}</span><img src={imageUrl(selected[previewPage])} alt={selected[previewPage].title} /><strong>{selected[previewPage].title}</strong></article><article className="preview-book-page preview-right-page">{selected[previewPage + 1] ? <><span className="preview-page-number">{previewPage + 2}</span><img src={imageUrl(selected[previewPage + 1])} alt={selected[previewPage + 1].title} /><strong>{selected[previewPage + 1].title}</strong></> : <div className="preview-last-page"><Logo /><strong>{title.trim() || 'Minu värviraamat'}</strong><span>Siin algavad sinu lood</span></div>}</article></div></div><div className="preview-controls"><button type="button" className="book-outline" disabled={previewPage === 0} onClick={() => setPreviewPage(Math.max(0, previewPage - 2))}>← Eelmised lehed</button><span aria-live="polite">{previewPage + 1}–{Math.min(previewPage + 2, selected.length)} / {selected.length}</span><button type="button" className="book-outline" disabled={previewPage + 2 >= selected.length} onClick={() => setPreviewPage(Math.min(selected.length - 1, previewPage + 2))}>Järgmised lehed →</button></div><div className="preview-thumbnails" aria-label="Valitud leheküljed">{selected.map((page,index)=><button type="button" key={page.id} aria-label={`Ava lehekülg ${index + 1}: ${page.title}`} aria-current={index === previewPage || index === previewPage + 1 ? 'page' : undefined} onClick={() => setPreviewPage(index % 2 === 0 ? index : index - 1)}><img src={imageUrl(page)} alt="" /><span>{index + 1}</span></button>)}</div></section>
        <aside className="preview-order-card"><h2>Sinu raamat</h2><div className="preview-cover"><Logo /><strong>{title.trim() || 'Minu värviraamat'}</strong><span>{selected.length} värvimislehekülge</span></div><dl><div><dt>Lehekülgi</dt><dd>{selected.length}</dd></div><div><dt>Raamatu hind</dt><dd>{money(total)}</dd></div></dl><button type="button" className="book-outline" onClick={() => setPreviewStep(false)}>Muuda pilte</button><button type="button" className="book-primary" onClick={() => setCheckout(true)}>Jätka tellimusega <span aria-hidden="true">→</span></button></aside>
      </div>}
    </main>
  </div>

  if (checkout) return <div className="book-page checkout-page">
    <header className="book-header"><button className="book-logo" onClick={() => setCheckout(false)} aria-label="Tagasi raamatu juurde"><Logo /></button><nav aria-label="Tellimuse sammud"><button onClick={() => setCheckout(false)}>Tagasi kujunduse juurde</button><span>1. Leheküljed</span><span>2. Eelvaade</span><strong>3. Maksmine</strong></nav></header>
    <main className="checkout-main"><div className="checkout-heading"><h1>Peaaegu valmis!</h1><p>Vali, kuidas sinu värviraamat sinuni jõuab.</p></div><div className="checkout-layout">
      <div className="checkout-forms">
        <section className="book-card"><h2>Kohaletoimetamine</h2><div className="delivery-options">{[['standard','Tavaline kuller','Raamat saabub, kui saabub. Tõenäoliselt varem kui tütre järgmine sünnipäev.',290],['courier','Asutaja toob kohale','Käsitsi, isiklikult ja pliiasid taskus. Ütleb ukse peal: tubli värvimist!',3900],['worldwide','Ülemaailmne asutaja-teenus','Asutaja toob raamatu käsitsi kohale, kus iganes sa oled.',1000000]].map(([id,label,description,price]) => <label className={`delivery-option ${delivery === id ? 'selected' : ''}`} key={id}><input type="radio" name="delivery" value={id} checked={delivery === id} onChange={() => setDelivery(id)} /><span><strong>{label}</strong><small>{description}</small></span><b>{money(price)}</b></label>)}</div></section>
        <section className="book-card"><h2>Sinu andmed</h2><div className="customer-fields"><label>Nimi<input name="name" autoComplete="name" value={customer.name} onChange={updateCustomer} placeholder="Eesnimi Perenimi" required /></label><label>E-post<input name="email" type="email" autoComplete="email" value={customer.email} onChange={updateCustomer} placeholder="sinu@epost.ee" required /></label><label className="address-field">Aadress või koordinaadid<input name="address" autoComplete="street-address" value={customer.address} onChange={updateCustomer} placeholder="Tänav, maja" required /></label></div></section>
        <section className="book-card"><h2>Makseviis</h2><div className="payment-options">{[['card','Pangakaart'],['link','Pangalink'],['invoice','Arve']].map(([id,label])=><button type="button" key={id} aria-pressed={payment === id} onClick={() => setPayment(id)}>{label}</button>)}</div><p className="checkout-note">Makse töötlemine lisatakse enne tellimuste vastuvõtmist.</p></section>
      </div><aside className="checkout-summary"><h2>Sinu tellimus</h2><div className="checkout-book"><strong>{title.trim() || 'Minu värviraamat'}</strong><span>Isiklik värviraamat, {selected.length} lehekülge</span></div><dl><div><dt>Raamat ({selected.length} lk × {money(45)})</dt><dd>{money(total)}</dd></div><div><dt>{delivery === 'standard' ? 'Tavaline kuller' : delivery === 'courier' ? 'Asutaja toob kohale' : 'Ülemaailmne teenus'}</dt><dd>{money(deliveryPrice)}</dd></div><div className="checkout-total"><dt>Kokku</dt><dd>{money(grandTotal)}</dd></div></dl><button className="book-primary" onClick={() => { if (!customer.name || !customer.email || !customer.address) { document.querySelector('.customer-fields input:invalid')?.focus(); return } order.current.showModal() }}>Maksa {money(grandTotal)}</button><p>Turvaline makse lisandub peagi.</p></aside>
    </div></main><dialog className="book-dialog" ref={order}><h2>Aitäh, {customer.name || 'sõber'}!</h2><p>Sinu {selected.length}-leheküljeline raamat on valmis. Makse töötlemine pole veel ühendatud, seega tellimust ega makset ei salvestatud.</p><form method="dialog"><button className="book-outline">Tagasi raamatu juurde</button></form></dialog>
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
          </section>
          <section className="book-pricing" aria-labelledby="price-title"><h2 id="price-title">Hinnakokkuvõte</h2><dl><div><dt>Lehekülgi</dt><dd>{selected.length}</dd></div><div><dt>Alushind</dt><dd>{money(800)}</dd></div><div><dt>{selected.length} lk × {money(45)}</dt><dd>{money(selected.length * 45)}</dd></div><div className="book-total"><dt>Hind kokku</dt><dd>{money(total)}</dd></div></dl><button className="book-primary" disabled={!selected.length} onClick={() => { setPreviewPage(0); setPreviewStep(true) }}>Vaata eelvaadet <span aria-hidden="true">→</span></button><p className="book-price-note">Hind sisaldab raamatu koostamist</p></section>
        </aside>
      </div>
    </main>
    <dialog className="book-dialog" ref={preview}><form method="dialog"><button className="dialog-close" aria-label="Sulge eelvaade">×</button></form><h2>{title.trim() || 'Minu värviraamat'}</h2><p>{selected.length} lehekülge · {money(total)}</p><div className="preview-pages">{selected.map((page, index) => <figure key={page.id}><img src={imageUrl(page)} alt={page.title} /><figcaption>{index + 1}. {page.title}</figcaption></figure>)}</div></dialog>
    <dialog className="book-dialog" ref={order}><h2>Sinu raamat on kokku pandud!</h2><p>Valisid {selected.length} lehekülge. Tellimuse vormistamine ja maksmine pole veel saadaval. Sinu valik säilib selles vaates.</p><form method="dialog"><button className="book-outline">Tagasi koostama</button></form></dialog>
  </div>
}
