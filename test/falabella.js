import test from 'ava'
import { matchProducts } from './helpers'

import { parseProducts, getProducts } from '../src/lib/scrapers/falabella'

import data from './data/falabella.json'

test('Parse the pages and match the list of products', t =>
  t.true(matchProducts(data, parseProducts)))

test('[live] Get the first page and return a list of 16 products', async t => {
  try {
    t.true((await getProducts(1)).products.length === 16)
  } catch (e) {
    t.fail()
  }
})

test('[live] Get the second page and return a list of 10 products', async t => {
  try {
    const payload = await getProducts(2, 10)
    const isSecondPage = (payload.nav.prev === '1' && payload.nav.next === '3')
    const productQty = payload.products.length === 10
    t.true(productQty && isSecondPage)
  } catch (e) {
    t.fail(e)
  }
})
