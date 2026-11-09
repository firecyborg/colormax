import Field from '../../shared/components/Field.jsx'
import { useState } from 'react'
import { registerAccount } from '../../../api/account.js'

function ValidateRegisterForm(values)  {

    const errors = {}

    if (!values.username.trim()) {
        errors.username = "Sisesta kasutajanimi"
    }
    else if (values.username.trim().length > 50) {
        errors.username = "Kasutajanimi võib olla kuni 50 tähte"
    }

    if (!values.email.trim()) {
        errors.email = "Sisesta e-post."
    }
    else if (values.email.trim().length > 255) {
        errors.email = "E-post võib olla kuni 255 märki."
    }
    else if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
        errors.email = "Sisesta korrektne E-posti aadress"
    }

    if (!values.password) {
    errors.password = "Sisesta parool."
    }
    if (!values.confirmPassword) {
    errors.confirmPassword = "Korda parooli."
    }
    else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Paroolid ei kattu."
    }

    if (!values.birthday.trim()) {
    errors.birthday = "Sisesta sünnikuupäev."
    }
    else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(values.birthday.trim())) {
    errors.birthday = "Kasuta kuju pp/kk/aaaa."
    }
    return errors
}






export default function RegisterForm({ onContinue }) {
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    return (
        <form noValidate onSubmit={async (event) => {
            event.preventDefault()

            const data = new FormData(event.currentTarget)

            const values = {
                username: data.get('register-username') ?? '',
                email: data.get('register-email') ?? '',
                birthday: data.get('birthday') ?? '',
                password: data.get('register-password') ?? '',
                confirmPassword: data.get('confirm-password') ?? '',
            }
        const validationErrors = ValidateRegisterForm(values)
        setErrors(validationErrors)

        if (Object.keys(validationErrors).length > 0) {
            return
        }

        setIsSubmitting(true)

        try {
            await registerAccount(values)
            await onContinue()
        }
        catch (error) {
            setErrors({
                server: error.message,
            })
        }
        finally {
            setIsSubmitting(false)
        }
    }}>
      <Field label="Email" name="register-email" type="email" autoComplete="email" />
      <Field label="Kasutaja nimi" name="register-username" autoComplete="username" />
      <Field label="Sünnipäev" name="birthday" placeholder="dd/mm/yyyy" autoComplete="bday" />
      <Field label="Parool" name="register-password" type="password" autoComplete="new-password" />
      <Field label="Korda parooli" name="confirm-password" type="password" autoComplete="new-password" />
      {Object.keys(errors).length > 0 && (
          <ul role="alert">
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>{message}</li>
                ))}
            </ul>
            )}
      <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Konto loomine…' : 'Loo konto'}
      </button>
    </form>
  )
}
