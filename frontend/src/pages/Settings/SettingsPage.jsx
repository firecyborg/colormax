import { useState } from 'react'
import Logo from '../shared/components/Logo.jsx'
import './SettingsPage.css'

export default function SettingsPage({ account, onLogout, onDelete, onHome }) {
    const [menuOpen, setMenuOpen] = useState(false)
    const [notice, setNotice] = useState('')
    const [confirmDelete, setConfirmDelete] = useState(false)
    const previewNotice = () => setNotice('See on näidisvaade. Tellimuste ja värviraamatute toimingud pole veel ühendatud.')

    return (
        <main className="settings-page">
            <header className="settings-header">
                <button className="settings-home" type="button" onClick={onHome} aria-label="Avaleht"><Logo /></button>
                <button className="menu-toggle" type="button" aria-label="Ava menüü" aria-expanded={menuOpen} aria-controls="account-menu" onClick={() => setMenuOpen(!menuOpen)}>
                    <span /><span /><span />
                </button>
                {menuOpen && <nav id="account-menu" className="account-menu" aria-label="Konto menüü">
                    <button type="button" onClick={() => setMenuOpen(false)}>Konto sätted</button>
                    <button type="button" onClick={onLogout}>Logi välja</button>
                </nav>}
            </header>
            <h1>Konto sätted</h1>
            <section className="settings-card" aria-labelledby="account-heading">
                <h2 id="account-heading">Konto andmed</h2>
                <div className="account-identity">
                    <span className="account-avatar" aria-hidden="true">{account.name.charAt(0).toUpperCase()}</span>
                    <div><span className="account-label">Konto nimi</span><p className="account-name">{account.name}</p></div>
                </div>
                <dl className="account-details">
                    <div><dt>E-post</dt><dd>{account.email}</dd></div>
                    <div><dt>Sünnipäev</dt><dd>{account.birthday}</dd></div>
                </dl>
            </section>
            <section className="settings-card" aria-labelledby="orders-heading">
                <h2 id="orders-heading">Minu tellimused</h2>
                    {account.orders.map((order) => (
                        <div className="settings-item" key={order.id}>
                        <div className="order-summary"><div><h3>Tellimus nr {order.id}</h3><p>{order.page_count} lehekülge · {order.total_price} €</p></div><span className="order-status">{order.status}</span></div>
                        <button type="button" className="outline-button" onClick={previewNotice}>Telli uuesti</button>
                        </div>
                    ))}
            </section>
            <section className="settings-card" aria-labelledby="books-heading">
                <h2 id="books-heading">Minu värviraamatud</h2>
                {account.books.map((book) => (
                    <div className="settings-item" key={book.id}><h3>{book.title}</h3><p>Salvestatud koostatud raamat</p></div>
                ))}
                <button type="button" className="primary-button" onClick={previewNotice}>Loo uus värviraamat</button>
            </section>
            {notice && <p className="settings-notice" role="status">{notice}</p>}
            <section className="settings-card" aria-labelledby="logout-heading">
                <h2 id="logout-heading">Logi välja</h2>
                <p>Logi sellest seadmest oma kontolt välja.</p>
                <button type="button" className="outline-button" onClick={onLogout}>Logi välja</button>
            </section>
            <section className="settings-card danger-card" aria-labelledby="delete-heading">
                <h2 id="delete-heading">Kustuta konto</h2>
                <p>Konto ja kõik sinu salvestatud värviraamatud kustutatakse jäädavalt. Seda ei saa tagasi võtta.</p>
                {confirmDelete ? <div className="delete-confirmation">
                    <p>Kas soovid konto koos loodud raamatutega igavesti kustutada?</p>
                    <button type="button" className="danger-button" onClick={onDelete}>Kustuta konto</button>
                    <button type="button" className="outline-button" onClick={() => setConfirmDelete(false)}>Loobu</button>
                </div> : <button type="button" className="danger-button" onClick={() => setConfirmDelete(true)}>Kustuta konto</button>}
            </section>
        </main>
    )
}
