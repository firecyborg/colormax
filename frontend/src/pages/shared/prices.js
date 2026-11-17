// Näidishinnad
export const BASE_PRICE = 800
export const PAGE_PRICE = 45

export const DELIVERY_OPTIONS = [
  {
    id: 'courier',
    name: 'Tavaline kuller',
    price: 290,
    description: 'Raamat saabub, kui saabub. Tõenäoliselt varem kui tütre järgmine sünnipäev.',
  },
  {
    id: 'founder',
    name: 'Asutaja toob kohale',
    price: 3900,
    description: 'Käsitsi, isiklikult ja pliiatsid taskus. Ütleb ukse peal: tubli värvimist!',
  },
  {
    id: 'worldwide',
    name: 'Ülemaailmne asutaja-teenus',
    price: 1000000,
    description: 'Asutaja toob raamatu käsitsi kohale, kus iganes sa oled.',
    footnote: 'Asutaja pakib kohvri juba täna.',
  },
]

export const money = (cents) =>
  new Intl.NumberFormat('et-EE', { style: 'currency', currency: 'EUR' }).format(cents / 100)