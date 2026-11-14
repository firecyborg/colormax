import { useState, useEffect } from 'react'
import { getAccountData, logoutAccount, deleteAccount } from "./api/account.js";
import LoginPage from './pages/Login/LoginPage.jsx'
import RegisterPage from './pages/Register/RegisterPage.jsx'
import SettingsPage from './pages/Settings/SettingsPage.jsx'
import BookPage from './pages/Book/BookPage.jsx'
import HomePage from './pages/Home/HomePage.jsx'
import './App.css'


function toAccount(user) {
    return {
        name: user.username,
        email: user.email,
        birthday: user.birthday,
        books: user.books,
        orders: user.orders,
    }
}
export default function App() {
    const [screen, setScreen] = useState('home')
    const [account, setAccount] = useState(null)
    const [isCheckingSession, setIsCheckingSession] = useState(true)
    const [sessionError, setSessionError] = useState('')

    useEffect(() => {
        let active = true

        async function restoreSession() {
            try {
                const result = await getAccountData()
                if (!active) {
                    return
                }
                if (result !== null) {
                    setAccount(toAccount(result.user))
                }
            }
            catch (error) {
                if (active) {
                    setSessionError(error.message)
                }
            }
            finally {
                if (active) {
                    setIsCheckingSession(false)
                }
            }
        }

        restoreSession()

        return () => {
            active = false
        }
    }, [])

    const openSettings = async () => {
        const result = await getAccountData()

        if (result === null) {
            throw new Error('Seanss puudub. Logi uuesti sisse.')
        }

        setAccount(toAccount(result.user))
        setScreen('settings')
        window.scrollTo(0, 0)
    }

    const logout = async () => {
        try {
            await logoutAccount()

            setAccount(null)
            setScreen('login')
            window.scrollTo(0, 0)
        }
        catch(error) {
            window.alert(error.message)
        }
    }
    const processDelete = async () => {
        try {
            await deleteAccount()
            setAccount(null)
            setScreen('login')
        }
        catch (error) {
        window.alert(error.message)
        }
    }
    if (isCheckingSession) {
    return <p role="status">Kontrollin sisselogimist…</p>
    }

    if (sessionError) {
        return (
            <p role="alert">
                {sessionError} Proovi lehte uuesti laadida.
            </p>
        )
    }
    if (screen === 'book') return <BookPage onHome={() => setScreen('home')} onAccount={() => setScreen(account ? 'settings' : 'login')} />

    if (screen === 'home') return <HomePage onCreate={() => setScreen('book')} onAccount={() => setScreen(account ? 'settings' : 'login')} />

    if (screen === 'settings') return <SettingsPage account={account} onLogout={logout} onDelete={processDelete} />

    const registration = screen === 'register'

    return (
        <main className="auth-preview">
        <nav className="screen-switch" aria-label="Vaate valimine">
            <button type="button" aria-pressed={!registration} onClick={() => setScreen('login')}>Logi sisse</button>
            <button type="button" aria-pressed={registration} onClick={() => setScreen('register')}>Loo konto</button>
        </nav>
        {registration ? (
            <RegisterPage onContinue={openSettings} onLogin={() => setScreen('login')} />
        ) : (
            <LoginPage onContinue={openSettings} onRegister={() => setScreen('register')} />
        )}
        </main>
    )
}
