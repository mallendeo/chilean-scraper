/* eslint no-console:0 */

import chalk from 'chalk'
import handler from './lib/handler'

const scraper = handler.loadScraper('casaroyal')

scraper.getAllProducts({ total: 5 })

scraper.emitter.on('gettingProducts', data => {
  console.log(chalk.green('\n\t============================='))

  if (!data.cList) {
    console.log(chalk.white.bold('page:'), data.page)
  }

  if (data.total) {
    console.log(chalk.white.bold('\tprogress:'),
      chalk.cyan(data.i + 1), 'of', chalk.cyan(data.total), '\n')
  }

  if (data.cList) {
    const category = data.cList[data.cIndex]
    const nextCategory = data.cList[data.cIndex + 1]
    console.log(chalk.white.bold('\tname:'), chalk.cyan(category.name))
    console.log(chalk.white.bold('\tcategory:'),
      chalk.cyan(data.cIndex), 'of', chalk.cyan(data.cList.length))
    console.log(chalk.white.bold('\tnext category:'), chalk.cyan(nextCategory.name))
  }

  console.log(chalk.green('\t============================='))
  console.log(chalk.red('-----------------------------\n'))
})

let total = 0
scraper.emitter.on('gotProducts', ({ data: { products, nav } }) => {
  console.log(chalk.cyan('  # products total:'), chalk.green(total += products.length))
  console.log(chalk.cyan('  # nav:'), chalk.green('prev'),
    nav.prev, '|', chalk.green('next:'), nav.next)
})
