import { cleanText, cleanPrice, getDOM } from '../helpers'

export const HOST = 'http://www.casaroyal.cl'

export const makeUrl = (url, page = 1) => `${url}?pag=${page}`

export const parseCategories = $ => $('.menu-item-object-product_cat a')
  .map((i, elem) => ({
    name: cleanText($(elem).text()),
    href: $(elem).attr('href'),
  })).get()

export const getCategories = () => getDOM(HOST).then(({ $ }) => parseCategories($))

export const getNav = ($, res) => {
  const nav = $('.pagination')
  const current = nav.find('.current')
  const prev = cleanText(current.prev('a').text())
  const next = cleanText(current.next('a').text())

  const uri = res.request.path
  const replace = (str, num) => str && str.replace(/(\?pag=)(\d{1,})/g, `$1${num}`)

  return {
    prev: prev ? HOST + replace(uri, prev) : null,
    current: HOST + replace(uri, current.text()),
    next: next ? HOST + replace(uri, next) : null,
  }
}

export const parseProducts = ($, res) => {
  const elems = $('.producto')

  const nav = getNav($, res)
  const products = elems.map((i, elem) => {
    const link = $(elem).find('a.base').attr('href')
    const img = $(elem).find('.wp-post-image').attr('src')
    const name = $(elem).find('.producto-hover .producto-nombre').text()
    const price = $(elem).find('.producto-hover .precio-nuevo .amount').text()

    return {
      name: cleanText(name),
      price: cleanPrice(price),
      link,
      img,
    }
  }).get()

  return { products, nav }
}

export const getProducts = (url, page) => getDOM(makeUrl(url, page))
  .then(({ $, res }) => parseProducts($, res))
