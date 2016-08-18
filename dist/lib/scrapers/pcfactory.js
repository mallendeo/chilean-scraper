'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProducts = exports.parseProducts = exports.getNav = exports.getCategories = exports.parseCategories = exports.makeUrl = exports.HOST = undefined;

var _helpers = require('../helpers');

var HOST = exports.HOST = 'https://pcfactory.cl';

var makeUrl = exports.makeUrl = function makeUrl(url) {
  var page = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
  return url + '&pagina=' + page;
};

var parseCategories = exports.parseCategories = function parseCategories($) {
  return $('.main_link[href*="?papa"]').map(function (i, elem) {
    return {
      name: (0, _helpers.cleanText)($(elem).text()),
      href: HOST + $(elem).attr('href')
    };
  }).get();
};

var getCategories = exports.getCategories = function getCategories() {
  return (0, _helpers.getDOM)(HOST + '/mapa').then(function (_ref) {
    var $ = _ref.$;
    return parseCategories($);
  });
};

var getNav = exports.getNav = function getNav($, res) {
  var nav = $('#spx_mostrando ~ table .main').parent();
  var next = nav.next().children('a').attr('href');
  var prev = nav.prev().children('a').attr('href');

  return {
    prev: prev ? HOST + prev : null,
    current: HOST + res.request.path,
    next: next ? HOST + next : null
  };
};

var parseProducts = exports.parseProducts = function parseProducts(_ref2) {
  var $ = _ref2.$;
  var res = _ref2.res;
  var body = _ref2.body;

  var elems = $('.content > div > table:nth-of-type(3) > tr > td');

  var nav = getNav($, res);
  var products = elems.map(function (i, elem) {
    if ($(elem).text().length < 10) return null;

    var link = $(elem).find('tr[id^="link_ficha"] a').attr('href');
    var img = $(elem).find('img[src^="/foto/"]').attr('src');
    var name = $(elem).find('.nombre_corto').text();
    var brand = $(elem).find('.main_mini').text();
    var price = $(elem).find('.precioGrupo').text();

    return {
      name: (0, _helpers.cleanText)(name),
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