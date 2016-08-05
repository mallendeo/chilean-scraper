# buscatodo-scraper

BuscaTodo's scraping tool.

## Install

```bash
$ npm install mallendeo/buscatodo-scraper#master
```

## Usage

Supported websites:

  - [Falabella](http://falabella.com)
  - [Paris](http://paris.cl)
  - [PC Factory](https://pcfactory.cl)
  - [Ripley](http://ripley.cl)
  - [SP Digital](http://spdigital.cl)
  - [Sodimac](http://sodimac.cl)
  - [Olimex](http://olimex.cl)

...

## Development
```bash
$ git clone https://github.com/mallendeo/buscatodo-scraper
$ cd buscatodo-scraper
$ npm install
```
### Test

```bash
$ npm test
```

### Update test sample data for a website

If debug is enabled, test data will not be saved.
```bash
$ # npm run update:test {websiteIds-list} {pages=5} {debug=false}
$ npm run update:test pcfactory 5
$ npm run update:test pcfactory,ripley,pcfactory 5
$ npm run update:test paris 10 true
```

## License
Copyright 2016 BuscaTodo
