/* eslint no-console:0 */

import handler from './lib/handler'

const scraper = handler.loadScraper('spdigital')

scraper.getAllProducts()

scraper.emitter.on('gettingProducts', data => {
  if (data.category) {
    console.log('=============================')
    console.log('\tname:', data.category.name)
    console.log('\tcategory:', data.cIndex, 'of', data.cList.length)
    console.log('\tnext category:', data.nextCategory.name)
    console.log('=============================')
    console.log('--')
    return
  }
  console.log('=============================')
  console.log('page:', data.page)
  console.log('=============================')
})

let total = 0
scraper.emitter.on('gotProducts', ({ products, nav }) => {
  console.log('products total:', total += products.length)
  console.log('nav:', nav)
})
