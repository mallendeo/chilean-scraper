import test from 'ava'
import { matchProducts } from './helpers'

import {
  parseProducts,
  getProducts,
  getCategories,
} from '../src/lib/scrapers/casaroyal'

import data from './data/casaroyal.json'
import pages from './pages/casaroyal.json'

test('Parse the pages and match the list of products', t =>
  t.true(matchProducts(pages, data, parseProducts)))

test('[live] Get all the categories from the homepage', async t => {
  try {
    t.true((await getCategories()).length > 0)
  } catch (e) {
    t.fail(e)
  }
})

test('[live] Get a list of products from the first category', async t => {
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
