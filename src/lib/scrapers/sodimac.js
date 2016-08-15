import { cleanText, cleanPrice, getDOM } from '../helpers'

export const HOST = 'http://www.sodimac.cl'
const SEARCH_URL = `${HOST}/sodimac-cl/search/`

export const makeUrl = (page = 1, qty = 16, search = '') =>
  `${SEARCH_URL}?&No=${(page - 1) * qty}`
  + `&Ntt=${search}&Nrpp=${qty}`

export const getNav = $ => {
  const nav = $('.pagination').first()
  const current = nav.find('.active')
  const prev = cleanText(current.prev().text())
  const next = cleanText(current.next().text())

  return {
    prev: prev || null,
    current: cleanText(current.text()),
    next: next || null,
  }
}

export const parseProducts = ({ $, res, body }) => {
  const elems = $('.one-prod')

  const nav = getNav($)
  const products = elems.map((i, elem) => {
    const isEmpty = $(elem).html() === '&#xA0;'
    if (isEmpty) return null

    const link = $(elem).find('.info-box .name')
      .children('a')
      .attr('href')

    const img = $(elem).find('img[data-original]').attr('data-original')
    const name = $(elem).find('.info-box .name').text()
    const brand = $(elem).find('.brand').text()
    const price = $(elem).find('.price b').text()

    return {
      name: cleanText(name),
      price: cleanPrice(price),
      brand: cleanText(brand),
      link: HOST + link,
      img,
    }
  }).get()

  return { products, nav, res, body }
}

export const getProducts = (page, qty, search) =>
  getDOM(makeUrl(page, qty, search)).then(parseProducts)
