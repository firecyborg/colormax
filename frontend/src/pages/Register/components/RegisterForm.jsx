import Field from '../../shared/components/Field.jsx'

export default function RegisterForm() {
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <Field label="Email" name="register-email" type="email" autoComplete="email" />
      <Field label="Kasutaja nimi" name="register-username" autoComplete="username" />
      <Field label="Sünnipäev" name="birthday" placeholder="dd/mm/yyyy" autoComplete="bday" />
      <Field label="Parool" name="register-password" type="password" autoComplete="new-password" />
      <Field label="Korda parooli" name="confirm-password" type="password" autoComplete="new-password" />
      <button className="primary-button" type="submit">Loo konto</button>
    </form>
  )
}
