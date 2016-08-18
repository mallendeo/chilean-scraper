'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProducts = exports.parseProducts = exports.getNav = exports.makeUrl = exports.HOST = undefined;

var _helpers = require('../helpers');

var HOST = exports.HOST = 'http://www.olimex.cl';
var SEARCH_URL = HOST + '/shop/page/';

var makeUrl = exports.makeUrl = function makeUrl() {
  var page = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
  var qty = arguments.length <= 1 || arguments[1] === undefined ? 24 : arguments[1];
  var search = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
  return '' + SEARCH_URL + page + '?attrib_orden=0&search=' + search + '&attrib_cant=' + qty;
};

var getNav = exports.getNav = function getNav($) {
  var nav = $('.pagination');
  var current = nav.find('.active');
  var prev = current.prev().children('a').attr('href');
  var next = current.next().children('a').attr('href');

  return {
    prev: prev ? HOST + prev : null,
    current: HOST + current.children('a').attr('href'),
    next: next ? HOST + next : null
  };
};

var parseProducts = exports.parseProducts = function parseProducts(_ref) {
  var $ = _ref.$;
  var res = _ref.res;
  var body = _ref.body;

  var elems = $('.product-grid-holder .product-item');

  var nav = getNav($);
  var products = elems.map(function (i, elem) {
    var link = $(elem).find('.title a').attr('href');
    var img = $(elem).find('.image img').data('echo');
    var name = $(elem).find('.title').text();
    var brand = $(elem).find('.brand').text();
    var price = $(elem).find('span[itemprop="price"]').text();

    return {
      name: (0, _helpers.cleanText)(name),
      price: (0, _helpers.cleanPrice)(price),
      brand: (0, _helpers.cleanText)(brand),
      link: HOST + link,
      img: HOST + img
    };
  }).get();

  return { products: products, nav: nav, res: res, body: body };
};

var getProducts = exports.getProducts = function getProducts(page, qty, search) {
  return (0, _helpers.getDOM)(makeUrl(page, qty, search), { cookie: 'website_lang=es_CL;' }).then(parseProducts);
};