import iconv from 'iconv-lite'
import cheerio from 'cheerio'
import axios from 'axios'

export const getDOM = (url, headers = {}) =>
  axios.get(url, {
    headers,
    responseType: 'arraybuffer'
  }).then(res => {
    const decode = res.headers['content-type'] &&
      res.headers['content-type'].toLowerCase().includes('iso-8859-1')

    const body = iconv.decode(res.data, decode ? 'iso-8859-1' : 'utf-8')
    const $ = cheerio.load(body)

    return { $, res, body }
  })

export const cleanText = text => text.trim().replace(/[\r\n\t®]/ig, '')
export const cleanPrice = price => parseInt(price.replace(/[\$\.]/g, ''), 10)
