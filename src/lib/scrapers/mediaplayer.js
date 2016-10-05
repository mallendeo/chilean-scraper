import { cleanText, cleanPrice, getDOM } from '../helpers'

export const HOST = 'http://tienda.mediaplayer.cl/'

export const makeUrl = (page = 1, qty = 45) =>
  `${HOST}accesorios.html/?&cat=2&limit=${qty}&p=${page}`

export const getNav = $ => {
  const nav = $('.pages').first()
  const current = nav.find('.current')
  const prev = cleanText(current.prev().text())
  const next = cleanText(current.next().text())

  return {
    prev: prev || null,
    current: cleanText(current.text()),
    next: next || null
  }
}

export const parseProducts = ({ $, res, body }) => {
  const elems = $('.products-grid .item')

  const nav = getNav($)
  const products = elems.map((i, elem) => {
    if ($(elem).html().length < 10) return null

    const link = $(elem).find('.product-name a').attr('href')
    const img = $(elem).find('.product-image img').attr('src')
    const name = $(elem).find('.product-name').text()
    const price = $(elem).find('.regular-price').text()

    return {
      name: cleanText(name),
      price: cleanPrice(price),
      link,
      img
    }
  }).get()

  return { products, nav, res, body }
}

export const getProducts = (page, qty) =>
  getDOM(makeUrl(page, qty)).then(parseProducts)
