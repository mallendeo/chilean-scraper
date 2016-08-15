import cheerio from 'cheerio'
import fs from 'fs-extra'

export const compare = (a, b) => JSON.stringify(a) === JSON.stringify(b)

export const matchProducts = (data, parser) => !(data.some(info => {
  const html = fs.readFileSync(`./pages/${info.file}`, 'utf8')
  const payload = parser({ $: cheerio.load(html), res: info.res })
  return !(compare(payload.products, info.payload.products))
}))
