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


export async function LoginToAccount(values) {
  const response = await fetch('/api/account/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: values.username.trim(),
      password: values.password,
    }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Sisse logimine ebaõnnestus.')
  }
  return data
}


export async function getAccountData() {
    const response = await fetch('/api/account/data', {})
    if (response.status === 401) {
        return null
    }
    const data = await response.json()
    if(!response.ok) {
        throw new Error(data.error || "Andmete saamine ebaõnnestus.")
    }
    return data
}

export async function logoutAccount(){
    const response = await fetch("/api/account/logout", {
        method: "POST",
    })
    const data = await response.json()
    if(!response.ok) {
        throw new Error(data.error || "Väljalogimine ebaõnnestus")
    }
    return data
}

export async function deleteAccount(){
    const response = await fetch("/api/account/delete", {
        method: "DELETE",
    })
    const data = await response.json()
    if(!response.ok) {
        throw new Error(data.error || "Konto kustutamine ebaõnnestus")
    }
    return data
}


