'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProducts = exports.parseProducts = exports.getCategories = exports.parseCategories = exports.getNav = exports.makeUrl = exports.HOST = undefined;

var _helpers = require('../helpers');

var HOST = exports.HOST = 'https://www.spdigital.cl';

var makeUrl = exports.makeUrl = function makeUrl(url) {
  var page = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
  return url + '/page:' + page;
};

var getNav = exports.getNav = function getNav($) {
  var nav = $('.pagination');
  var current = nav.find('.active');
  var next = nav.find('a.next').attr('href');
  var prev = nav.find('a.prev').attr('href');

  return {
    prev: prev ? HOST + prev : null,
    current: HOST + current.children('a').attr('href'),
    next: next ? HOST + next : null
  };
};

var parseCategories = exports.parseCategories = function parseCategories($) {
  return $('.category-children-item-menu a').map(function (i, elem) {
    return {
      name: (0, _helpers.cleanText)($(elem).text()),
      href: HOST + $(elem).attr('href')
    };
  }).get();
};

var getCategories = exports.getCategories = function getCategories() {
  return (0, _helpers.getDOM)(HOST).then(function (_ref) {
    var $ = _ref.$;
    return parseCategories($);
  }).then(function (categories) {
    // fix for some categories that don't have the correct
    // url formatting
    var promises = [];
    categories.forEach(function (category) {
      if (!category.href.includes('categories')) {
        promises.push((0, _helpers.getDOM)(category.href).then(function (_ref2) {
          var $ = _ref2.$;
          return {
            name: category.name,
            href: getNav($).current.replace('/page:1', '')
          };
        }));
      }
    });

    return Promise.all(promises).then(function (newCategories) {
      return categories.map(function (category) {
        var newCateg = newCategories.find(function (nc) {
          return nc.name === category.name;
        });
        if (newCateg) category.href = newCateg.href;
        return category;
      });
    });
  });
};

var parseProducts = exports.parseProducts = function parseProducts(_ref3) {
  var $ = _ref3.$;
  var res = _ref3.res;
  var body = _ref3.body;

  var elems = $('.product-item-mosaic');

  var nav = getNav($);
  var products = elems.map(function (i, elem) {
    var link = $(elem).find('.name a').attr('href');
    var img = $(elem).find('.image img').attr('src');

    var originalName = $(elem).find('.name [data-original-title]').attr('data-original-title');
    var name = $(elem).find('.name').text();
    var stock = $(elem).find('.name').next().text();

    // discard product if there's no stock
    if (stock.includes('AGOTADO') || stock.includes('PEDIDO')) return null;

    var brand = $(elem).find('.brand').text();
    var price = $(elem).find('.cash-price').text();

    return {
      name: originalName || (0, _helpers.cleanText)(name),
      price: (0, _helpers.cleanPrice)(price),
      brand: (0, _helpers.cleanText)(brand),
      link: HOST + link,
      img: HOST + img
    };
  }).get().filter(function (p) {
    return p !== null;
  });

  return { products: products, nav: nav, res: res, body: body };
};

var getProducts = exports.getProducts = function getProducts(url, page) {
  return (0, _helpers.getDOM)(makeUrl(url, page)).then(parseProducts);
};