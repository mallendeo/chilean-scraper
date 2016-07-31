import * as paris from './lib/scrapers/paris'
import * as falabella from './lib/scrapers/falabella'
import * as pcfactory from './lib/scrapers/pcfactory'

paris.getProducts(0, 10, 'accesorios computacion').then(console.log)
