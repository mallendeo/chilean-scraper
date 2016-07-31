import { getBody } from './request'
import { cleanText } from './helpers'
import cheerio from 'cheerio'

const HOST = 'http://simple.ripley.cl'
const SEARCH_URL = `${HOST}/search/`

// TODO: get navigation

export const getProducts = (page = 0, qty = 10, search = '*') => {
  const url = `${SEARCH_URL}${search}?&page=${page}&pageSize=${qty}`
  return getBody(url).then(body => {
    const $ = cheerio.load(body)
    const elems = $('.catalog-container .catalog-product')

    return elems.map((i, elem) => {
      const link = $(elem).find('a.catalog-item').attr('href')
      const img = $(elem).find('.product-image img').attr('data-src')
      const name = $(elem).find('.catalog-product-name').text()
      const price = $(elem).find('.best-price').text().replace(/([^\d])/ig, '')

      return {
        name: cleanText(name),
        price: parseInt(price.replace(/[\$\.]/g, '')),
        link: `${HOST}${link}`,
        image: img,
      }
    }).get()
  })
}
