import test from 'ava'
import iconv from 'iconv-lite'
import fs from 'fs'
import cheerio from 'cheerio'

import {
  parseProducts,
  getProducts,
  getNav,
} from '../src/lib/scrapers/falabella'
import firstPageData from './data/falabella-products.json'

const PAGE_CONTENT = iconv.decode(fs.readFileSync('./pages/falabella-products.html'), 'ISO-8859-1')

test('Parse the page and match the list of products', t => {
  const payload = parseProducts(PAGE_CONTENT)
  t.is(JSON.stringify(firstPageData), JSON.stringify(payload))
})

test('Parse navigation, get next page, prev should be null', t => {
  const nav = getNav(cheerio.load(PAGE_CONTENT))
  t.true(nav.next === '2' && nav.prev === null)
})

test('[live] Get the first page and return a list of 16 products', async t => {
  const payload = await getProducts()
  if (payload.products.length === 16) return t.pass()
  t.fail()
})

test('[live] Get the second page and return a list of 100 products', async t => {
  const payload = await getProducts(2, 100)
  const isSecondPage = (payload.nav.prev === '1' && payload.nav.next === '3')
  const productQty = payload.products.length === 100
  t.true(productQty && isSecondPage)
})
