import Field from '../../shared/components/Field.jsx'

export default function LoginForm({ onContinue }) {
  return (
    <form noValidate onSubmit={(event) => {
      event.preventDefault()
      onContinue()
    }}>
      <Field label="Email / Kasutajanimi" name="login-username" placeholder="nimi@epost.ee või kasutajanimi" autoComplete="username" />
      <Field label="Parool" name="login-password" type="password" placeholder="••••••••" autoComplete="current-password" />
      <div className="login-options">
        <label className="remember" htmlFor="remember">Jäta mind meelde <input id="remember" type="checkbox" /></label>
        <button className="text-button" type="button">Unustasid parooli?</button>
      </div>
      <p className="demo-hint">Demovaade: jätka ka tühjade või näidisandmetega.</p>
      <button className="primary-button" type="submit">Logi sisse</button>
    </form>
  )
}
