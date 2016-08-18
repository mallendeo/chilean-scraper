import test from 'ava'
import { getProducts } from '../../src/lib/scrapers/ripley'

test('[live] Get the first page and return a list of 24 products', async t => {
  try {
    t.true((await getProducts(1)).products.length === 24)
  } catch (e) {
    t.fail(e)
  }
})

test('[live] Get the second page and return a list of 10 products', async t => {
  try {
    const { products, nav } = await getProducts(2, 10)
    t.true(products.length === 10
      && nav.prev.includes('page=1')
      && nav.next.includes('page=3'))
  } catch (e) {
    t.fail(e)
  }
})
