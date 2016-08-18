'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProducts = exports.parseProducts = exports.getNav = exports.getCategories = exports.parseCategories = exports.makeUrl = exports.HOST = undefined;

var _helpers = require('../helpers');

var HOST = exports.HOST = 'http://www.casaroyal.cl';

var makeUrl = exports.makeUrl = function makeUrl(url) {
  var page = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
  return url + '?pag=' + page;
};

var parseCategories = exports.parseCategories = function parseCategories($) {
  return $('.menu-item-object-product_cat a').map(function (i, elem) {
    return {
      name: (0, _helpers.cleanText)($(elem).text()),
      href: $(elem).attr('href')
    };
  }).get();
};

var getCategories = exports.getCategories = function getCategories() {
  return (0, _helpers.getDOM)(HOST).then(function (_ref) {
    var $ = _ref.$;
    return parseCategories($);
  });
};

var getNav = exports.getNav = function getNav($, res) {
  var nav = $('.pagination');
  var current = nav.find('.current');
  var prev = (0, _helpers.cleanText)(current.prev('a').text());
  var next = (0, _helpers.cleanText)(current.next('a').text());

  var uri = res.request.path;
  var replace = function replace(str, num) {
    return str && str.replace(/(\?pag=)(\d{1,})/g, '$1' + num);
  };

  return {
    prev: prev ? HOST + replace(uri, prev) : null,
    current: HOST + replace(uri, current.text()),
    next: next ? HOST + replace(uri, next) : null
  };
};

var parseProducts = exports.parseProducts = function parseProducts(_ref2) {
  var $ = _ref2.$;
  var res = _ref2.res;
  var body = _ref2.body;

  var elems = $('.producto');

  var nav = getNav($, res);
  var products = elems.map(function (i, elem) {
    var link = $(elem).find('a.base').attr('href');
    var img = $(elem).find('.wp-post-image').attr('src');
    var name = $(elem).find('.producto-hover .producto-nombre').text();
    var price = $(elem).find('.producto-hover .precio-nuevo .amount').text();

    return {
      name: (0, _helpers.cleanText)(name),
      price: (0, _helpers.cleanPrice)(price),
      link: link,
      img: img
    };
  }).get();

  return { products: products, nav: nav, res: res, body: body };
};

var getProducts = exports.getProducts = function getProducts(url, page) {
  return (0, _helpers.getDOM)(makeUrl(url, page)).then(parseProducts);
};