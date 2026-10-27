export default function Field({ label, name, type = 'text', placeholder, autoComplete }) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} placeholder={placeholder} autoComplete={autoComplete} />
    </div>
  )
}

