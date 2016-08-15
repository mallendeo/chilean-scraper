import { cleanText, cleanPrice, getDOM } from '../helpers'

export const HOST = 'https://pcfactory.cl'

export const makeUrl = (url, page = 1) => `${url}&pagina=${page}`

export const parseCategories = $ => $('.main_link[href*="?papa"]')
  .map((i, elem) => ({
    name: cleanText($(elem).text()),
    href: HOST + $(elem).attr('href'),
  })).get()

export const getCategories = () => getDOM(`${HOST}/mapa`)
  .then(({ $ }) => parseCategories($))

export const getNav = ($, res) => {
  const nav = $('#spx_mostrando ~ table .main').parent()
  const next = nav.next().children('a').attr('href')
  const prev = nav.prev().children('a').attr('href')

  return {
    prev: prev ? HOST + prev : null,
    current: HOST + res.request.path,
    next: next ? HOST + next : null,
  }
}

export const parseProducts = ({ $, res, body }) => {
  const elems = $('.content > div > table:nth-of-type(3) > tr > td')

  const nav = getNav($, res)
  const products = elems.map((i, elem) => {
    if ($(elem).text().length < 10) return null

    const link = $(elem).find('tr[id^="link_ficha"] a').attr('href')
    const img = $(elem).find('img[src^="/foto/"]').attr('src')
    const name = $(elem).find('.nombre_corto').text()
    const brand = $(elem).find('.main_mini').text()
    const price = $(elem).find('.precioGrupo').text()

    return {
      name: cleanText(name),
      price: cleanPrice(price),
      brand: cleanText(brand),
      link: HOST + link,
      img: HOST + img,
    }
  }).get().filter(p => p !== null)

  return { products, nav, res, body }
}

export const getProducts = (url, page) =>
  getDOM(makeUrl(url, page)).then(parseProducts)
