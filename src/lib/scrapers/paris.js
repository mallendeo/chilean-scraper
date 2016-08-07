import { cleanText, cleanPrice, getDOM } from '../helpers'

export const HOST = 'http://www.paris.cl'
const SEARCH_URL = `${HOST}/webapp/wcs/stores/servlet/AjaxCatalogSearchResultView`

export const makeUrl = (page = 1, qty = 10, search = '') => `${SEARCH_URL}?storeId=10801`
  + `&pageSize=${qty}&beginIndex=${(page - 1) * qty}&sType=SimpleSearch&searchTerm=${search}`

export const getNav = ($, res) => {
  const nav = $('.paging ul').first()
  const current = nav.find('.selected')

  const checkElem = elem => {
    if (elem.attr('style')) return null
    const match = $(elem).children('a')
      .attr('onclick')
      .match(/goToResultPage\('(.+?)',/)
    return match ? match[1] : null
  }

  const prev = checkElem(current.prev())
  const next = checkElem(current.next())

  return {
    prev: prev || null,
    current: HOST + res.request.path,
    next: next || null,
  }
}

export const parseProducts = ($, res) => {
  const elems = $('.item_container > .item')

  const nav = getNav($, res)
  const products = elems.map((i, elem) => {
    const link = $(elem).find('.description_fixedwidth > a').attr('href')
    const img = $(elem).find('.img img').attr('src')
    const name = $(elem).find('.description_fixedwidth > a').text()
    const price = $(elem).find('.offerPrice').text()

    return {
      name: cleanText(name),
      price: cleanPrice(price),
      link,
      img,
    }
  }).get()

  return { products, nav }
}

export const getProducts = (page, qty, search) =>
  getDOM(makeUrl(page, qty, search)).then(({ $, res }) => parseProducts($, res))
