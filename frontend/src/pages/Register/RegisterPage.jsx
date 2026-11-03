import Logo from '../shared/components/Logo.jsx'
import RegisterForm from './components/RegisterForm.jsx'

export default function RegisterPage({ onLogin, onContinue }) {
  return (
    <section className="auth-card register-card" aria-label="Konto loomine">
      <Logo />
      <RegisterForm onContinue={onContinue} />
      <footer className="auth-footer">
        <span>Juba konto olemas?</span>
        <button className="text-button" type="button" onClick={onLogin}>Logi sisse</button>
      </footer>
    </section>
  )
}
