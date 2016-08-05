import cheerio from 'cheerio'

export const compare = (a, b) => JSON.stringify(a) === JSON.stringify(b)

export const matchProducts = (pages, data, parser) => !(pages.some(page => {
  const payload = parser(cheerio.load(page.body), page.res)
  const products = data.find(p => p.url === page.url)
  return !(compare(payload, products.payload))
}))
