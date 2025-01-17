# chilean-scraper

Products scraping tool for chilean websites

## Install

```bash
$ npm install mallendeo/chilean-scraper#master
```

## Usage

Supported websites:

  - [CasaRoyal](http://casaroyal.cl)
  - [Falabella](http://falabella.com)
  - [MediaPlayer](http://mediaplayer.cl)
  - [Olimex](http://olimex.cl)
  - [Paris](http://paris.cl)
  - [PC Factory](https://pcfactory.cl)
  - [Ripley](http://ripley.cl)
  - [Sodimac](http://sodimac.cl)
  - [SP Digital](http://spdigital.cl)

...

## Development
```bash
$ git clone https://github.com/mallendeo/chilean-scraper
$ cd chilean-scraper
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
