import test from 'ava'

import {
  getProducts,
  getCategories
} from '../../src/lib/scrapers/casaroyal'

test('[live] Get all the categories from the homepage', async (t) => {
  try {
    t.true((await getCategories()).length > 0)
  } catch (e) {
    t.fail(e)
  }
})

test('[live] Get a list of products from the first category', async (t) => {
  try {
    const categories = await getCategories()
    const { nav, products } = await getProducts(categories[0].href, 1)
    const firstPage = (nav.prev === null && nav.next.endsWith('2'))
    const productQty = products.length > 4
    t.true(productQty && firstPage)
  } catch (e) {
    t.fail(e)
  }
})
