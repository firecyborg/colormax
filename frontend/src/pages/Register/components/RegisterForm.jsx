import Field from '../../shared/components/Field.jsx'

export default function RegisterForm({ onContinue }) {
  return (
    <form noValidate onSubmit={(event) => {
      event.preventDefault()
      const data = new FormData(event.currentTarget)
      onContinue({ name: data.get('register-username')?.trim(), email: data.get('register-email')?.trim(), birthday: data.get('birthday')?.trim() })
    }}>
      <Field label="Email" name="register-email" type="email" autoComplete="email" />
      <Field label="Kasutaja nimi" name="register-username" autoComplete="username" />
      <Field label="Sünnipäev" name="birthday" placeholder="dd/mm/yyyy" autoComplete="bday" />
      <Field label="Parool" name="register-password" type="password" autoComplete="new-password" />
      <Field label="Korda parooli" name="confirm-password" type="password" autoComplete="new-password" />
      <p className="demo-hint">Demovaade: jätka ka tühjade või näidisandmetega.</p>
      <button className="primary-button" type="submit">Loo konto</button>
    </form>
  )
}
