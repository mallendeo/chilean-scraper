import test from 'ava'
import _ from 'lodash/fp'
import scrapers from '../src/lib/scrapers'

const checkPropsType = ({ products, nav: { current, prev, next } }) =>
  !products.some(({ name, price, link, img, brand }) => {
    const checkProps = (name.length && _.isString(name)
      && price && _.isInteger(price)
      && link && link.match(/^https?:\/\//)
      && img && img.match(/^https?:\/\//))

    const checkBrand = brand ? _.isString(brand) && brand.length : true
    const checkNav = pag => (pag ? _.isString(pag) && pag.length : true)

    return !checkBrand
      && !checkProps
      && !checkNav(prev)
      && !checkNav(current)
      && !checkNav(next)
  })

Object.keys(scrapers).forEach(key => {
  const scraper = scrapers[key]
  test(`[live] Check property types for ${key}`, async t => {
    try {
      const categories = scraper.getCategories && await scraper.getCategories()
      if (categories) {
        t.true(checkPropsType(await scraper.getProducts(categories[0].href, 1)))
        return
      }

      t.true(checkPropsType(await scraper.getProducts(1)))
    } catch (e) {
      t.fail(e)
    }
  })
})

