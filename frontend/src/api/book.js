export async function saveBook(title, pageIds) {
  const response = await fetch('/api/book/make_book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: title.trim() || 'Minu värviraamat',
      pages: pageIds,
      length: pageIds.length,
    }),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok || !data?.book) {
    throw new Error(data?.error || 'Raamatu salvestamine ebaõnnestus.')
  }

  return data.book
}
