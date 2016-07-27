import { getDecodedBody } from './request'
import cheerio from 'cheerio'

const HOST = 'http://www.falabella.com'

const falabellaScraper = () => {
  const getAllProducts = () => {

  }

  const cleanText = text => text.replace(/[\r\n\t]/ig, '')

  const getProductsByPage = (page = 0, qty = 10) => {
    let url = `${HOST}/falabella-cl/search/?&No=${page * qty}&Ntt=&Nrpp=${qty}`
    url += '&userSelectedFormat=list'
    return getDecodedBody(url)
      .then(body => {
        const $ = cheerio.load(body)
        const elems = $('#contenedorInterior .cajaLP1x')

        let items = []
        elems.each((i, elem) => {
          const isEmpty = $(elem).html() === '&#xA0;'
          if (isEmpty) return

          let id = $(elem).find('.comparadorCajaLP1x > input').val()
          const matches = id.match(/\d+/g)

          id = matches ? matches[0] : null;

          const link  = $(elem).find('.detalle > a').attr('href')
          const img   = $(elem).find('img[data-original]').attr('data-original')
          const name  = $(elem).find('.detalle').text()
          const brand = $(elem).find('.marca').text()
          const price = $(elem).find('.precio1 span').text()

          items.push({
            id: parseInt(id),
            name: cleanText(name),
            price: parseInt(price.replace(/[\$\.]/g, '')),
            brand: cleanText(brand.replace(/®/g, '')),
            link: `${HOST}${link}`,
            image: img,
          })
        })
        console.log(items);
      })
  }

  return {
    getProductsByPage
  }
}

export default falabellaScraper
