import test from 'ava'
import { getProducts } from '../../src/lib/scrapers/sodimac'

test('[live] Get the first page and return a list of 16 products', async t => {
  try {
    t.true((await getProducts(1)).products.length === 16)
  } catch (e) {
    t.fail()
  }
})

test('[live] Get the second page and check nav', async t => {
  try {
    const { products, nav } = await getProducts(2)
    t.true(products.length === 16 && nav.prev === '1' && nav.next === '3')
  } catch (e) {
    t.fail(e)
  }
})
