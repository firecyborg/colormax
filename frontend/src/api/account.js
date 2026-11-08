export async function registerAccount(values) {
  const response = await fetch('/api/account/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: values.username.trim(),
      email: values.email.trim(),
      password: values.password,
      birthday: values.birthday.trim(),
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Registreerimine ebaõnnestus.')
  }

  return data
}