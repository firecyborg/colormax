import { useEffect, useState } from 'react'
import Logo from '../shared/components/Logo.jsx'
import { BASE_PRICE, PAGE_PRICE, DELIVERY_OPTIONS, money } from '../shared/prices.js'
import './CheckoutPage.css'

const PAYMENT_OPTIONS = [
  { id: 'card', name: 'Pangakaart', note: 'Kaardimakse käib turvaliselt makseteenuse pakkuja kaudu.' },
  { id: 'banklink', name: 'Pangalink', note: 'Maksmiseks suuname sind oma panka.' },
  { id: 'invoice', name: 'Arve', note: 'Saadame arve sinu e-postile.' },
]

export default function CheckoutPage({ title, pages, onHome, onPages, onPreview, onSubmit }) {
  const [delivery, setDelivery] = useState(DELIVERY_OPTIONS[0].id)
  const [payment, setPayment] = useState(PAYMENT_OPTIONS[0].id)
  const [customer, setCustomer] = useState({ name: '', email: '', address: '' })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const pageCount = pages.length
  const pagesPrice = pageCount * PAGE_PRICE
  const deliveryOption = DELIVERY_OPTIONS.find((option) => option.id === delivery)
  const paymentOption = PAYMENT_OPTIONS.find((option) => option.id === payment)
  const total = BASE_PRICE + pagesPrice + deliveryOption.price

  const updateCustomer = (event) =>
    setCustomer({ ...customer, [event.target.name]: event.target.value })

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit({
      title: title.trim(),
      pageIds: pages.map((page) => page.id),
      delivery,
      payment,
      customer,
    })
  }

  return (
    <div className="pay-page">
      <header className="pay-header">
        <button className="pay-logo" onClick={onHome} aria-label="Avaleht">
          <Logo />
        </button>
        <nav aria-label="Tellimuse sammud">
          <button onClick={onHome}>Tagasi kodulehele</button>
          <button onClick={onPages}>1. Leheküljed</button>
          {onPreview ? <button onClick={onPreview}>2. Eelvaade</button> : <span>2. Eelvaade</span>}
          <span className="pay-current" aria-current="step">3. Maksmine</span>
        </nav>
      </header>

      <main className="pay-main">
        <h1>Peaaegu valmis!</h1>
        <p className="pay-lead">Vali, kuidas raamat sinuni jõuab.</p>

        <form className="pay-layout" onSubmit={handleSubmit}>
          <div className="pay-column">
            <fieldset className="pay-card">
              <legend>Kohaletoimetamine</legend>
              {DELIVERY_OPTIONS.map((option) => (
                <label key={option.id} className="pay-option">
                  <input
                    type="radio"
                    name="delivery"
                    value={option.id}
                    checked={delivery === option.id}
                    onChange={() => setDelivery(option.id)}
                  />
                  <span className="pay-option-text">
                    <strong>{option.name}</strong>
                    <small>{option.description}</small>
                  </span>
                  <span className="pay-option-price">{money(option.price)}</span>
                </label>
              ))}
            </fieldset>

            <fieldset className="pay-card">
              <legend>Sinu andmed</legend>
              <div className="pay-fields">
                <label>
                  Nimi
                  <input name="name" required autoComplete="name" placeholder="Eesnimi Perenimi"
                    value={customer.name} onChange={updateCustomer} />
                </label>
                <label>
                  E-post
                  <input name="email" type="email" required autoComplete="email" placeholder="sinu@epost.ee"
                    value={customer.email} onChange={updateCustomer} />
                </label>
                <label className="pay-wide">
                  Aadress või koordinaadid
                  <input name="address" required autoComplete="street-address" placeholder="Tänav, maja"
                    value={customer.address} onChange={updateCustomer} />
                </label>
              </div>
            </fieldset>

            <fieldset className="pay-card">
              <legend>Makseviis</legend>
              <div className="pay-methods">
                {PAYMENT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={payment === option.id}
                    onClick={() => setPayment(option.id)}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
              <p className="pay-note">{paymentOption.note}</p>
            </fieldset>
          </div>

          <aside className="pay-summary" aria-labelledby="pay-summary-title">
            <h2 id="pay-summary-title">Sinu tellimus</h2>
            <div className="pay-book">
              <strong>{title.trim() || 'Minu värviraamat'}</strong>
              <small>Isiklik värviraamat, {pageCount} lehekülge</small>
            </div>
            <dl>
              <div><dt>Alushind</dt><dd>{money(BASE_PRICE)}</dd></div>
              <div><dt>Leheküljed ({pageCount} lk × {money(PAGE_PRICE)})</dt><dd>{money(pagesPrice)}</dd></div>
              <div><dt>{deliveryOption.name}</dt><dd>{money(deliveryOption.price)}</dd></div>
              <div className="pay-total"><dt>Kokku</dt><dd>{money(total)}</dd></div>
            </dl>
            <button type="submit" className="pay-submit" disabled={!pageCount}>
              Maksa {money(total)}
            </button>
            {deliveryOption.footnote && <p className="pay-footnote">{deliveryOption.footnote}</p>}
          </aside>
        </form>
      </main>
    </div>
  )
}