import { cleanText, getDOM } from '../helpers'
import { parse } from 'url'

export const HOST = 'http://simple.ripley.cl'
const SEARCH_URL = `${HOST}/search/`

export const makeUrl = (page = 1, qty = 24, search = '*') => `${SEARCH_URL}${search}`
  + `?&page=${page}&pageSize=${qty}&orderBy=3`

export const getNav = ($, res) => {
  const nav = $('.pagination')
  const current = nav.find('.is-active')
  const next = current.parent()
    .next()
    .children('a')
    .attr('href')
  const prev = current.parent()
    .prev()
    .children('a')
    .attr('href')
  const uri = parse(res.request.path)

  return {
    prev: prev.length > 2 ? `${HOST}${uri.pathname}?${prev.replace('#', '')}` : null,
    current: HOST + uri.path,
    next: next.length > 2 ? `${HOST}${uri.pathname}?${next.replace('#', '')}` : null,
  }
}

export const parseProducts = ($, res) => {
  const elems = $('.catalog-container .catalog-product')

  const nav = getNav($, res)
  const products = elems.map((i, elem) => {
    const link = $(elem).attr('href')
    const img = $(elem).find('.product-image img').attr('data-src')
    const name = $(elem).find('.catalog-product-name').text()
    const price = $(elem).find('.best-price').text()
      .replace(/([^\d])/ig, '')

    return {
      name: cleanText(name),
      price: parseInt(price.replace(/[\$\.]/g, ''), 10),
      link: HOST + link,
      img: `http:${img}`,
    }
  }).get()

  return { products, nav }
}

export const getProducts = (page, qty, search) => getDOM(makeUrl(page, qty, search))
  .then(({ $, res }) => parseProducts($, res))
