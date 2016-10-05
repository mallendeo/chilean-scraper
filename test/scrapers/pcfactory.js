import test from 'ava'

import {
  getProducts,
  getCategories
} from '../../src/lib/scrapers/pcfactory'

test('[live] Return array of products from the first page and check nav', async (t) => {
  try {
    const categories = await getCategories()
    const { products, nav } = await getProducts(categories[0].href, 1)
    if (!products.length) t.fail('Empty array of products')
    if (nav.prev !== null && !nav.next.endsWith('2')) t.fail('Incorrect nav:', nav)
  } catch (e) {
    t.fail(e)
  }
})
