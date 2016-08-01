import { cleanText, getBody } from '../helpers'
import cheerio from 'cheerio'

const HOST = 'http://www.paris.cl'
const SEARCH_URL = `${HOST}/webapp/wcs/stores/servlet/AjaxCatalogSearchResultView`

const makeUrl = (page, qty, search) =>
  `${SEARCH_URL}?storeId=10801&pageSize=${qty}&beginIndex=${page * qty}&sType=SimpleSearch&searchTerm=${search}`

export const getNav = ($, qty, search) => {
  const nav = $('.paging ul').first()
  const current = nav.find('.selected')
  const prev = cleanText(current.prev().text())
  const next = cleanText(current.next().text())

  return {
    prev: prev && makeUrl(prev, qty, search),
    current: makeUrl(cleanText(current.text()), qty, search),
    next: next && makeUrl(next, qty, search),
  }
}

export const parseProducts = body => {
  const $ = cheerio.load(body)
  const elems = $('.item_container > .item')

  const nav = getNav($)
  const products = elems.map((i, elem) => {
    const link = $(elem).find('.description_fixedwidth > a').attr('href')
    const img = $(elem).find('.img img').attr('src')
    const name = $(elem).find('.description_fixedwidth > a').text()
    const price = $(elem).find('.offerPrice').text()

    return {
      name: cleanText(name),
      price: parseInt(price.replace(/[\$\.]/g, '')),
      link,
      img,
    }
  }).get()

  return { products, nav }
}

export const getProducts = (page = 0, qty = 10, search = '') =>
  getBody(makeUrl(page, qty, search)).then(({ body }) => parseProducts(body))
