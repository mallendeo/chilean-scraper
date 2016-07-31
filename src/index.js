import falabellaScraper from './lib/scrapers/falabella'
import ripleyScraper from './lib/scrapers/ripley'

ripleyScraper().getProducts().then(console.log)
