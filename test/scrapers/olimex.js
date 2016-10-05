import test from 'ava'
import { getProducts } from '../../src/lib/scrapers/olimex'

test('[live] Get the first page and return a list of 24 products', async (t) => {
  try {
    t.true((await getProducts(1)).products.length === 24)
  } catch (e) {
    t.fail()
  }
})

test('[live] Get 48 products from the fifth page and check nav', async (t) => {
  try {
    const qty = 48
    const { products, nav } = await getProducts(5, qty)
    t.true(
      products.length === qty &&
      nav.prev.includes('/page/4') &&
      nav.next.includes('/page/6')
    )
  } catch (e) {
    t.fail(e)
  }
})
