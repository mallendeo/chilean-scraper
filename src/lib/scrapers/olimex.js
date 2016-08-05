import { cleanText, getDOM } from '../helpers'

export const HOST = 'http://www.olimex.cl'
const SEARCH_URL = `${HOST}/shop/page/`

export const makeUrl = (page = 1, qty = 24, search = '') =>
  `${SEARCH_URL}${page}?attrib_orden=0&search=${search}&attrib_cant=${qty}`

export const getNav = $ => {
  const nav = $('.pagination')
  const current = nav.find('.active')
  const prev = current.prev().children('a').attr('href')
  const next = current.next().children('a').attr('href')

  return {
    prev: prev ? HOST + prev : null,
    current: HOST + current.children('a').attr('href'),
    next: next ? HOST + next : null,
  }
}

export const parseProducts = $ => {
  const elems = $('.product-grid-holder .product-item')

  const nav = getNav($)
  const products = elems.map((i, elem) => {
    const link = $(elem).find('.title a').attr('href')
    const img = $(elem).find('.image img').data('echo')
    const name = $(elem).find('.title').text()
    const brand = $(elem).find('.brand').text()
    const price = $(elem).find('span[itemprop="price"]').text()

    return {
      name: cleanText(name),
      price: parseInt(price.replace(/[\$\.]/g, ''), 10),
      brand: cleanText(brand.replace(/®/g, '')),
      link: HOST + link,
      img: HOST + img,
    }
  }).get()

  return { products, nav }
}

export const getProducts = (page, qty, search) =>
  getDOM(makeUrl(page, qty, search), {
    cookie: 'website_lang=es_CL;',
  }).then(({ $ }) => parseProducts($))
