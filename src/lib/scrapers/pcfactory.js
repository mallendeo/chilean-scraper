import { cleanText, getBody } from '../helpers'
import cheerio from 'cheerio'

const HOST = 'https://pcfactory.cl'
const SEARCH_URL = `${HOST}?buscar=ID`

export const getNav = $ => {
  const nav = $('#spx_mostrando ~ table .main')
  const current = nav.children('strong').text()
  const navParent = nav.parent()
  const next = navParent.next().children('a').attr('href')
  const prev = navParent.prev().children('a').attr('href')

  return {
    prev: prev && `${HOST}${prev}`,
    current: `${SEARCH_URL}&pagina=${current}`,
    next: next && `${HOST}${next}`,
  }
}

export const parseProducts = body => {
  const $ = cheerio.load(body)
  const elems = $('.content > div > table:nth-of-type(2) > tr > td')

  const nav = getNav($)
  const products = elems.map((i, elem) => {
    const link = $(elem).find('tr[id^="link_ficha"] a').attr('href')
    const img = $(elem).find('img[src^="/foto/"]').attr('src')
    const name = $(elem).find('.nombre_corto').text()
    const brand = $(elem).find('.main_mini').text()
    const price = $(elem).find('.precioGrupo').text()

    return {
      name: cleanText(name).replace(/®/g, ''),
      price: price.replace(/[\$\.]/g, ''),
      brand: cleanText(brand).replace(/®/g, ''),
      link: `${HOST}${link}`,
      img: `${HOST}${img}`,
    }
  }).get()

  return { products, nav }
}

export const getProducts = (page = 1) =>
  getBody(`${SEARCH_URL}&pagina=${page}`).then(({ body }) => parseProducts(body))
