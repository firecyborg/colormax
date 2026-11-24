import Logo from '../shared/components/Logo.jsx'
import LoginForm from './components/LoginForm.jsx'

export default function LoginPage({ onRegister, onContinue, onHome }) {
  return (
    <section className="auth-card login-card" aria-label="Sisselogimine">
      <button className="auth-home" type="button" onClick={onHome} aria-label="Avaleht"><Logo /></button>
      <header className="welcome">
        <h1>Tere tulemast tagasi</h1>
        <p>Logi enda kontosse sisse, et jätkata</p>
      </header>
      <LoginForm onContinue={onContinue} />
      <footer className="auth-footer">
        <span>Pole veel kontot?</span>
        <button className="text-button" type="button" onClick={onRegister}>Loo kasutaja</button>
      </footer>
    </section>
  )
}
