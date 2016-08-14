import EventEmitter from 'events'
import scrapers from './scrapers'

const loadScraper = scraperId => {
  if (!scraperId || !scrapers[scraperId]) throw new Error('Invalid scraper ID')

  const scraper = scrapers[scraperId]
  const emitter = new EventEmitter()

  const getAllProducts = (page = 1, qty, cList, cIndex = 0) => {
    if (scraper.getCategories) {
      // Get products by categories
      if (!cList) {
        emitter.emit('gettingCategories')
        return scraper.getCategories().then(categories => {
          emitter.emit('gotCategories', categories)
          return getAllProducts(page, qty, categories, cIndex)
        })
      }

      const category = cList[cIndex]
      const nextCategory = cList[cIndex + 1]
      emitter.emit('gettingProducts', {
        category,
        nextCategory,
        page,
        qty,
        cList,
        cIndex,
      })

      return scraper.getProducts(category.href, page)
        .then(({ products, nav }) => {
          emitter.emit('gotProducts', { products, nav })

          if (nav.next) return getAllProducts(page + 1, qty, cList, cIndex)
          if (nextCategory) return getAllProducts(1, qty, cList, cIndex + 1)
          return emitter.emit('done')
        })
        .catch(err => {
          emitter.emit('error', err)
          return getAllProducts(page, qty, cList, cIndex)
        })
    }

    // Get products vía search url
    emitter.emit('gettingProducts', { page, qty })

    return scraper.getProducts(page, qty)
      .then(({ products, nav }) => {
        emitter.emit('gotProducts', { products, nav })

        if (nav.next) return getAllProducts(page + 1, qty)
        return emitter.emit('done')
      })
      .catch(err => {
        emitter.emit('error', err)
        return getAllProducts(page, qty)
      })
  }

  return {
    getAllProducts,
    emitter,
  }
}

export default {
  scrapers,
  loadScraper,
}
