import test from 'ava'
import fs from 'fs'
import cheerio from 'cheerio'

import {
  parseProducts,
  parseCategories,
  getProducts,
  getCategories,
  getNav,
} from '../src/lib/scrapers/spdigital'
import firstPageData from './data/spdigital-products.json'

const HOST = 'http://spdigital.cl/'
const PAGE_CONTENT = fs.readFileSync('./pages/spdigital-products.html')

test('Parse random category page and match the list of products', t => {
  const payload = parseProducts(PAGE_CONTENT)
  t.is(JSON.stringify(firstPageData), JSON.stringify(payload))
})

test('Return an array of categories', async t => {
  const categories = parseCategories(PAGE_CONTENT)
  t.true(categories.length > 0)
})

test('Parse navigation, check prev and next links', t => {
  const nav = getNav(cheerio.load(fs.readFileSync('./pages/spdigital-products-4.html')))
  t.true(nav.prev.endsWith('3') && nav.next.endsWith('5'))
})

test('Parse navigation on first page, prev should be null', t => {
  const nav = getNav(cheerio.load(PAGE_CONTENT))
  t.true(nav.prev === null && nav.next.endsWith('2'))
})

test('[live] Get all the categories from the homepage', async t => {
  const categories = await getCategories()
  if (categories.length > 0) return t.pass()
  t.fail()
})

test('[live] Get a list of products from the first category', async t => {
  const categories = await getCategories()
  const payload = await getProducts(categories[0].href, 1)
  const firstPage = (payload.nav.prev === null && payload.nav.next.endsWith('2'))
  const productQty = payload.products.length > 4
  t.true(productQty && firstPage)
})
