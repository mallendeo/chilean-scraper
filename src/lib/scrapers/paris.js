import { cleanText, getDOM } from '../helpers'

export const HOST = 'http://www.paris.cl'
const SEARCH_URL = `${HOST}/webapp/wcs/stores/servlet/AjaxCatalogSearchResultView`

export const makeUrl = (page = 0, qty = 10, search = '') => `${SEARCH_URL}?storeId=10801`
  + `&pageSize=${qty}&beginIndex=${page * qty}&sType=SimpleSearch&searchTerm=${search}`

export const getNav = ($, qty, search) => {
  const nav = $('.paging ul').first()
  const current = nav.find('.selected')
  const prev = cleanText(current.prev().text())
  const next = cleanText(current.next().text())

  return {
    prev: prev ? makeUrl(prev, qty, search) : null,
    current: makeUrl(cleanText(current.text()), qty, search),
    next: next ? makeUrl(next, qty, search) : null,
  }
}

export const parseProducts = $ => {
  const elems = $('.item_container > .item')

  const nav = getNav($)
  const products = elems.map((i, elem) => {
    const link = $(elem).find('.description_fixedwidth > a').attr('href')
    const img = $(elem).find('.img img').attr('src')
    const name = $(elem).find('.description_fixedwidth > a').text()
    const price = $(elem).find('.offerPrice').text()

    return {
      name: cleanText(name),
      price: parseInt(price.replace(/[\$\.]/g, ''), 10),
      link,
      img,
    }
  }).get()

  return { products, nav }
}

export const getProducts = (page, qty, search) =>
  getDOM(makeUrl(page, qty, search)).then(({ body }) => parseProducts(body))
