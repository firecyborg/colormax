import { useState } from 'react'
import LoginPage from './pages/Login/LoginPage.jsx'
import RegisterPage from './pages/Register/RegisterPage.jsx'
import './App.css'

export default function App() {
  const [screen, setScreen] = useState('login')
  const registration = screen === 'register'

  return (
    <main className="auth-preview">
      <nav className="screen-switch" aria-label="Vaate valimine">
        <button type="button" aria-pressed={!registration} onClick={() => setScreen('login')}>Logi sisse</button>
        <button type="button" aria-pressed={registration} onClick={() => setScreen('register')}>Loo konto</button>
      </nav>
      {registration ? (
        <RegisterPage onLogin={() => setScreen('login')} />
      ) : (
        <LoginPage onRegister={() => setScreen('register')} />
      )}
    </main>
  )
}
