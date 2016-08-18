'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _scrapers = require('./lib/scrapers');

var _scrapers2 = _interopRequireDefault(_scrapers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loadScraper = function loadScraper(scraperId) {
  if (!scraperId || !_scrapers2.default[scraperId]) throw new Error('Invalid scraper ID');

  var scraper = _scrapers2.default[scraperId];
  var emitter = new _events2.default();

  var getAllProducts = function getAllProducts() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    opts.page = opts.page || 1;
    opts.cIndex = opts.cIndex || 0;
    opts.i = opts.i || 0;

    if (opts.total && parseInt(opts.i, 10) === parseInt(opts.total, 10)) {
      return emitter.emit('done', { pages: opts.total });
    }

    if (scraper.getCategories) {
      var _ret = function () {
        // Get products by categories
        if (!opts.cList) {
          setImmediate(function () {
            return emitter.emit('gettingCategories');
          });

          return {
            v: scraper.getCategories().then(function (categories) {
              emitter.emit('gotCategories', categories);
              opts.cList = categories;
              return getAllProducts(opts);
            })
          };
        }

        var category = opts.cList[opts.cIndex];
        var nextCategory = opts.cList[opts.cIndex + 1];

        emitter.emit('gettingProducts', opts);

        return {
          v: scraper.getProducts(category.href, opts.page).then(function (data) {
            data.category = category;
            emitter.emit('gotProducts', { data: data, opts: opts });

            if (data.nav.next) {
              opts.page += 1;
              opts.i += 1;
              return getAllProducts(opts);
            }

            if (nextCategory) {
              opts.page = 1;
              opts.cIndex += 1;
              opts.i += 1;
              return getAllProducts(opts);
            }

            return emitter.emit('done');
          }).catch(function (err) {
            emitter.emit('error', err);
            return getAllProducts(opts);
          })
        };
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }

    // Get products vía search url
    setImmediate(function () {
      return emitter.emit('gettingProducts', opts);
    });

    return scraper.getProducts(opts.page, opts.qty).then(function (data) {
      emitter.emit('gotProducts', { data: data, opts: opts });

      if (data.nav.next) {
        opts.page += 1;
        opts.i += 1;
        return getAllProducts(opts);
      }
      return emitter.emit('done');
    }).catch(function (err) {
      emitter.emit('error', err);
      return getAllProducts(opts);
    });
  };

  return {
    getAllProducts: getAllProducts,
    emitter: emitter
  };
};

exports.default = {
  scrapers: _scrapers2.default,
  loadScraper: loadScraper
};