import test from 'ava'
import { matchProducts } from './helpers'

import { parseProducts, getProducts } from '../src/lib/scrapers/ripley'

import data from './data/ripley.json'
import pages from './pages/ripley.json'

test('Parse the pages and match the list of products', t =>
  t.true(matchProducts(pages, data, parseProducts)))

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
    t.true(products.length === 10 && nav.prev.endsWith('1') && nav.next.endsWith('3'))
  } catch (e) {
    t.fail(e)
  }
})
