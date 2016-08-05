import test from 'ava'
import { matchProducts } from './helpers'

import {
  parseProducts,
  getProducts,
} from '../src/lib/scrapers/pcfactory'

import data from './data/pcfactory.json'
import pages from './pages/pcfactory.json'

test('Parse the pages and match the list of products', t =>
  t.true(matchProducts(pages, data, parseProducts)))

test('[live] Return array of products from the first page and check nav', async t => {
  try {
    const { products, nav } = await getProducts(1)
    if (!products.length) t.fail('Empty array of products')
    if (nav.prev !== null && !nav.next.endsWith('2')) t.fail('Incorrect nav:', nav)
  } catch (e) {
    t.fail(e)
  }
})
