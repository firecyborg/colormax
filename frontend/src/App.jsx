import { useState } from 'react'
import LoginPage from './pages/Login/LoginPage.jsx'
import RegisterPage from './pages/Register/RegisterPage.jsx'
import SettingsPage from './pages/Settings/SettingsPage.jsx'
import HomePage from './pages/Home/HomePage.jsx'
import './App.css'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [account, setAccount] = useState(null)
  const openSettings = (details = {}) => {
    setAccount({ name: details.name || 'Mari', email: details.email || 'mari@epost.ee', birthday: details.birthday || '14.03.1994' })
    setScreen('settings')
    window.scrollTo(0, 0)
  }
  const logout = () => {
    setAccount(null)
    setScreen('login')
    window.scrollTo(0, 0)
  }

  if (screen === 'home') return <HomePage onAccount={() => setScreen(account ? 'settings' : 'login')} />

  if (screen === 'settings') return <SettingsPage account={account} onLogout={logout} />

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
