import { cleanText, cleanPrice, getDOM } from '../helpers'

export const HOST = 'https://www.spdigital.cl'

export const makeUrl = (url, page = 1) => `${url}/page:${page}`

export const getNav = $ => {
  const nav = $('.pagination')
  const current = nav.find('.active')
  const next = nav.find('a.next').attr('href')
  const prev = nav.find('a.prev').attr('href')

  return {
    prev: prev ? HOST + prev : null,
    current: HOST + current.children('a').attr('href'),
    next: next ? HOST + next : null,
  }
}

export const parseCategories = $ => $('.category-children-item-menu a')
  .map((i, elem) => ({
    name: cleanText($(elem).text()),
    href: HOST + $(elem).attr('href'),
  })).get()

export const getCategories = () => getDOM(HOST)
  .then(({ $ }) => parseCategories($))
  .then(categories => {
    // fix for some categories that don't have the correct
    // url formatting
    const promises = []
    categories.forEach(category => {
      if (!category.href.includes('categories')) {
        promises.push(getDOM(category.href).then(({ $ }) =>
          ({
            name: category.name,
            href: getNav($).current.replace('/page:1', ''),
          })
        ))
      }
    })

    return Promise.all(promises).then(newCategories =>
      categories.map(category => {
        const newCateg = newCategories.find(nc => nc.name === category.name)
        if (newCateg) category.href = newCateg.href
        return category
      }))
  })

export const parseProducts = $ => {
  const elems = $('.product-item-mosaic')

  const nav = getNav($)
  const products = elems.map((i, elem) => {
    const link = $(elem).find('.name a').attr('href')
    const img = $(elem).find('.image img').attr('src')

    const originalName = $(elem)
      .find('.name [data-original-title]')
      .attr('data-original-title')
    const name = $(elem).find('.name').text()

    // discard product if there's no stock
    if ($(elem).find('.name').text().includes('AGOTADO')) return null

    const brand = $(elem).find('.brand').text()
    const price = $(elem).find('.cash-price').text()

    return {
      name: originalName || cleanText(name),
      price: cleanPrice(price),
      brand: cleanText(brand),
      link: HOST + link,
      img: HOST + img,
    }
  }).get().filter(p => p !== null)

  return { products, nav }
}

export const getProducts = (url, page) => getDOM(makeUrl(url, page))
  .then(({ $ }) => parseProducts($))
