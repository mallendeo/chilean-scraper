import test from 'ava'
import { matchProducts } from './helpers'

import { parseProducts, getProducts } from '../src/lib/scrapers/sodimac'

import data from './data/sodimac.json'
import pages from './pages/sodimac.json'

test('Parse the pages and match the list of products', t =>
  t.true(matchProducts(pages, data, parseProducts)))

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
