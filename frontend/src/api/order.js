export async function registerOrder(orderDetails) {
  const response = await fetch('/api/order/register_order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderDetails),
  })

  const data = await response.json().catch(() => null)
  if (!response.ok || !data?.order) {
    throw new Error(data?.error || 'Tellimuse salvestamine ebaõnnestus.')
  }

  return data.order
}
