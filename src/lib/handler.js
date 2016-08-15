import EventEmitter from 'events'
import scrapers from './scrapers'

const loadScraper = scraperId => {
  if (!scraperId || !scrapers[scraperId]) throw new Error('Invalid scraper ID')

  const scraper = scrapers[scraperId]
  const emitter = new EventEmitter()

  const getAllProducts = (opts = {}) => {
    opts.page = opts.page || 1
    opts.cIndex = opts.cIndex || 0
    opts.i = opts.i || 0

    if (opts.total && parseInt(opts.i, 10) === parseInt(opts.total, 10)) {
      return emitter.emit('done', { pages: opts.total })
    }

    if (scraper.getCategories) {
      // Get products by categories
      if (!opts.cList) {
        setImmediate(() => emitter.emit('gettingCategories'))

        return scraper.getCategories().then(categories => {
          emitter.emit('gotCategories', categories)
          opts.cList = categories
          return getAllProducts(opts)
        })
      }

      const category = opts.cList[opts.cIndex]
      const nextCategory = opts.cList[opts.cIndex + 1]

      emitter.emit('gettingProducts', opts)

      return scraper.getProducts(category.href, opts.page)
        .then(data => {
          data.category = category
          emitter.emit('gotProducts', { data, opts })

          if (data.nav.next) {
            opts.page += 1
            opts.i += 1
            return getAllProducts(opts)
          }

          if (nextCategory) {
            opts.page = 1
            opts.cIndex += 1
            opts.i += 1
            return getAllProducts(opts)
          }

          return emitter.emit('done')
        })
        .catch(err => {
          emitter.emit('error', err)
          return getAllProducts(opts)
        })
    }

    // Get products vía search url
    setImmediate(() => emitter.emit('gettingProducts', opts))

    return scraper.getProducts(opts.page, opts.qty)
      .then(data => {
        emitter.emit('gotProducts', { data, opts })

        if (data.nav.next) {
          opts.page += 1
          opts.i += 1
          return getAllProducts(opts)
        }
        return emitter.emit('done')
      })
      .catch(err => {
        emitter.emit('error', err)
        return getAllProducts(opts)
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
