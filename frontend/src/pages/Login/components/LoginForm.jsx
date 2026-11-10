import Field from '../../shared/components/Field.jsx'
import {useState} from "react";
import {LoginToAccount} from "../../../api/account.js";


function ValidateLoginForm(values) {

    const errors = {}

    if (!values.username.trim()) {
        errors.username = "Sisesta kasutajanimi"
    } else if (values.username.trim().length > 255) {
        errors.username = "Kasutajanimi/Email võib olla kuni 255 tähte"
    }

    if (!values.password) {
        errors.password = "Sisesta parool."
    }
    return errors
}

export default function LoginForm({ onContinue }) {
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    return (
        <form noValidate onSubmit={async(event) => {
        event.preventDefault()
            const data = new FormData(event.currentTarget)

        const values = {
            username: data.get('login-username') ?? '',
            password: data.get('login-password') ?? '',
        }

        const validationErrors = ValidateLoginForm(values)
        setErrors(validationErrors)

        if (Object.keys(validationErrors).length > 0) {
            return
        }

        setIsSubmitting(true)
        try {
            await LoginToAccount(values)
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
            <Field label="Email / Kasutajanimi" name="login-username" placeholder="nimi@epost.ee või kasutajanimi" autoComplete="username" />
            <Field label="Parool" name="login-password" type="password" placeholder="••••••••" autoComplete="current-password" />
            {Object.keys(errors).length > 0 && (
            <ul role="alert">
                {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                    ))}
                </ul>
            )}
            <div className="login-options">
            <label className="remember" htmlFor="remember">Jäta mind meelde <input id="remember" type="checkbox" /></label>
                <button className="text-button" type="button">Unustasid parooli?
                </button>
        </div>
        <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sisse logimine' : 'Logi Sisse'}
        </button>
        </form>
    )
}
