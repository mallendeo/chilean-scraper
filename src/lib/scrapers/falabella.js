import { cleanText, getBody } from '../helpers'
import cheerio from 'cheerio'

const HOST = 'http://www.falabella.com'
const SEARCH_URL = `${HOST}/falabella-cl/search/`

const makeUrl = (page, qty, search) =>
  `${SEARCH_URL}?&No=${(page - 1) * qty}&Ntt=${search}&Nrpp=${qty}&userSelectedFormat=list`

export const getNav = $ => {
  const nav = $('#paginador').first()
  const current = nav.find('.destacadoLista')
  const prev = cleanText(current.prev().text())
  const next = cleanText(current.next().text())

  return {
    prev: prev || null,
    current: cleanText(current.text()),
    next: next || null,
  }
}

export const parseProducts = body => {
  const $ = cheerio.load(body)
  const elems = $('#contenedorInterior .cajaLP1x')

  const nav = getNav($)
  const products = elems.map((i, elem) => {
    const isEmpty = $(elem).html() === '&#xA0;'
    if (isEmpty) return

    const link = $(elem).find('.detalle > a').attr('href')
    const img = $(elem).find('img[data-original]').attr('data-original')
    const name = $(elem).find('.detalle').text()
    const brand = $(elem).find('.marca').text()
    const price = $(elem).find('.precio1 span').text()

    return {
      name: cleanText(name),
      price: parseInt(price.replace(/[\$\.]/g, '')),
      brand: cleanText(brand.replace(/®/g, '')),
      link: `${HOST}${link}`,
      img,
    }
  }).get()

  return { products, nav }
}

export const getProducts = (page = 1, qty = 16, search = '') =>
  getBody(makeUrl(page, qty, search), true).then(({ body }) => parseProducts(body))
