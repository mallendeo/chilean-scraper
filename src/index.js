import falabellaScraper from './lib/scrapers/falabella'

falabellaScraper().getProductsByPage().then(console.log)
