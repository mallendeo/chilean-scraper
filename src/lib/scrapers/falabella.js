import { getDecodedBody } from './request'
import { cleanText } from './helpers'
import cheerio from 'cheerio'

const HOST = 'http://www.falabella.com'
const SEARCH_URL = `${HOST}/falabella-cl/search/`

const falabellaScraper = () => {
  const getProductsByPage = (page = 0, qty = 10) => {
    const url = `${SEARCH_URL}?&No=${page * qty}&Ntt=&Nrpp=${qty}&userSelectedFormat=list`
    return getDecodedBody(url).then(body => {
      const $ = cheerio.load(body)
      const elems = $('#contenedorInterior .cajaLP1x')

      return elems.map((i, elem) => {
        const isEmpty = $(elem).html() === '&#xA0;'
        if (isEmpty) return

        const id = $(elem).find('.comparadorCajaLP1x > input').val().match(/\d+/g)[0]

        const link  = $(elem).find('.detalle > a').attr('href')
        const img   = $(elem).find('img[data-original]').attr('data-original')
        const name  = $(elem).find('.detalle').text()
        const brand = $(elem).find('.marca').text()
        const price = $(elem).find('.precio1 span').text()

        return {
          id: parseInt(id),
          name: cleanText(name),
          price: parseInt(price.replace(/[\$\.]/g, '')),
          brand: cleanText(brand.replace(/®/g, '')),
          link: `${HOST}${link}`,
          image: img,
        }
      }).get()
    })
  }

  return { getProductsByPage }
}

export default falabellaScraper
