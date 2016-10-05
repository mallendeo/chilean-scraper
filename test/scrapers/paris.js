import test from 'ava'

import { getProducts } from '../../src/lib/scrapers/paris'

test('[live] Get the first page and return a list of 10 products', async (t) => {
  try {
    t.true((await getProducts(1, 10)).products.length === 10)
  } catch (e) {
    t.fail(e)
  }
})

test('[live] Get the second page and return a list of 20 products', async (t) => {
  const pageSize = 10
  const page = 4
  try {
    const { products, nav } = await getProducts(page, pageSize)
    t.true(
      products.length === pageSize &&
      nav.prev.includes(`beginIndex=${pageSize * (page - 2)}`) &&
      nav.current.includes(`beginIndex=${pageSize * (page - 1)}`) &&
      nav.next.includes(`beginIndex=${pageSize * page}`)
    )
  } catch (e) {
    t.fail(e)
  }
})
