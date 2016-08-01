import { cleanText, getBody } from '../helpers'
import cheerio from 'cheerio'

const HOST = 'https://www.spdigital.cl'

export const parseCategories = body => {
  const $ = cheerio.load(body)
  return $('.category-children-item-menu a').map((i, elem) => ({
    name: cleanText($(elem).text()),
    href: `${HOST}${$(elem).attr('href')}`,
  })).get()
}

export const getCategories = () =>
  getBody(HOST).then(({ body }) => parseCategories(body))

export const getNav = $ => {
  const nav = $('.pagination')
  const current = nav.find('.active')
  let next = nav.find('a.next').attr('href')
  let prev = nav.find('a.prev').attr('href')

  return {
    prev: prev ? `${HOST}${prev}` : null,
    current: `${HOST}${current.children('a').attr('href')}`,
    next: next ? `${HOST}${next}` : null,
  }
}

export const parseProducts = body => {
  const $ = cheerio.load(body)
  const elems = $('.product-item-mosaic')

  const nav = getNav($)
  const products = elems.map((i, elem) => {
    const link = $(elem).find('.name a').attr('href')
    const img = $(elem).find('.image img').attr('src')

    const originalName = $(elem)
      .find('.name [data-original-title]')
      .attr('data-original-title')
    const name = $(elem).find('.name').text()

    const brand = $(elem).find('.brand').text()
    const price = $(elem).find('.cash-price').text()

    return {
      name: originalName || cleanText(name),
      price: price.replace(/[\$\.]/g, ''),
      brand: cleanText(brand).replace(/®/g, ''),
      link: `${HOST}${link}`,
      img: `${HOST}${img}`,
    }
  }).get()

  return { products, nav }
}

export const getProducts = (url, page = 1) =>
  getBody(`${url}/page:${page}`).then(({ body }) => parseProducts(body))
