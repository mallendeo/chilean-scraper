import { cleanText, getBody } from '../helpers'
import cheerio from 'cheerio'

const HOST = 'http://simple.ripley.cl'
const SEARCH_URL = `${HOST}/search/`

export const getNav = ($, res) => {
  const nav = $('.pagination')
  const current = nav.find('.is-active')
  const next = current.parent().next().children('a').attr('href')
  const prev = current.parent().prev().children('a').attr('href')
  const uri = res.request.uri

  return {
    prev: prev ? `${HOST}${uri.pathname}?${prev.replace('#', '')}` : null,
    current: `${HOST}${uri.path}`,
    next: next ? `${HOST}${uri.pathname}?${next.replace('#', '')}` : null,
  }
}

export const parseProducts = (body, res) => {
  const $ = cheerio.load(body)
  const elems = $('.catalog-container .catalog-product')

  const nav = getNav($, res)
  const products = elems.map((i, elem) => {
    const link = $(elem).attr('href')
    const img = $(elem).find('.product-image img').attr('data-src')
    const name = $(elem).find('.catalog-product-name').text()
    const price = $(elem).find('.best-price').text().replace(/([^\d])/ig, '')

    return {
      name: cleanText(name),
      price: parseInt(price.replace(/[\$\.]/g, '')),
      link: `${HOST}${link}`,
      img,
    }
  }).get()

  return { products, nav }
}

export const getProducts = (page = 0, qty = 24, search = '*') =>
  getBody(`${SEARCH_URL}${search}?&page=${page}&pageSize=${qty}&orderBy=3`)
    .then(({ body, res }) => parseProducts(body, res))
