'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProducts = exports.parseProducts = exports.getNav = exports.makeUrl = exports.HOST = undefined;

var _url = require('url');

var _helpers = require('../helpers');

var HOST = exports.HOST = 'http://simple.ripley.cl';
var SEARCH_URL = HOST + '/search/';

var makeUrl = exports.makeUrl = function makeUrl() {
  var page = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
  var qty = arguments.length <= 1 || arguments[1] === undefined ? 24 : arguments[1];
  var search = arguments.length <= 2 || arguments[2] === undefined ? '*' : arguments[2];
  return '' + SEARCH_URL + search + ('?&page=' + page + '&pageSize=' + qty + '&orderBy=3');
};

var getNav = exports.getNav = function getNav($, res) {
  var nav = $('.pagination');
  var current = nav.find('.is-active');
  var next = current.parent().next().children('a').attr('href');
  var prev = current.parent().prev().children('a').attr('href');
  var uri = (0, _url.parse)(res.request.path);

  return {
    prev: prev.length > 2 ? '' + HOST + uri.pathname + '?' + prev.replace('#', '') : null,
    current: HOST + uri.path,
    next: next.length > 2 ? '' + HOST + uri.pathname + '?' + next.replace('#', '') : null
  };
};

var parseProducts = exports.parseProducts = function parseProducts(_ref) {
  var $ = _ref.$;
  var res = _ref.res;
  var body = _ref.body;

  var elems = $('.catalog-container .catalog-product');

  var nav = getNav($, res);
  var products = elems.map(function (i, elem) {
    var link = $(elem).attr('href');
    var img = $(elem).find('.product-image img').attr('data-src');
    var name = $(elem).find('.catalog-product-name').text();
    var price = $(elem).find('.best-price').text().replace(/([^\d])/ig, '');

    return {
      name: (0, _helpers.cleanText)(name),
      price: (0, _helpers.cleanPrice)(price),
      link: HOST + link,
      img: 'http:' + img
    };
  }).get();

  return { products: products, nav: nav, res: res, body: body };
};

var getProducts = exports.getProducts = function getProducts(page, qty, search) {
  return (0, _helpers.getDOM)(makeUrl(page, qty, search)).then(parseProducts);
};