import test from 'ava'
import fs from 'fs-extra'
import cheerio from 'cheerio'
import scrapers from '../src/lib/scrapers'

const compare = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const matchProducts = (data, parser) => !(data.some(info => {
  const html = fs.readFileSync(`./pages/${info.file}`, 'utf8')
  const payload = parser({ $: cheerio.load(html), res: info.res })
  return !(compare(payload.products, info.payload.products))
}))

Object.keys(scrapers).forEach(key => {
  const scraper = scrapers[key]
  test(`Parse the pages and match the list of products from ${key}`, t => {
    const data = fs.readJsonSync(`./data/${key}.json`, { throws: false })
    t.true(matchProducts(data, scraper.parseProducts))
  })
})

