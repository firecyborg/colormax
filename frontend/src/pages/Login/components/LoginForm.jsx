import Field from '../../shared/components/Field.jsx'

export default function LoginForm() {
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <Field label="Email / Kasutajanimi" name="login-username" autoComplete="username" />
      <Field label="Parool" name="login-password" type="password" placeholder="••••••••" autoComplete="current-password" />
      <div className="login-options">
        <label className="remember" htmlFor="remember">Jäta mind meelde <input id="remember" type="checkbox" /></label>
        <button className="text-button" type="button">Unustasid parooli?</button>
      </div>
      <button className="primary-button" type="submit">Logi sisse</button>
    </form>
  )
}
