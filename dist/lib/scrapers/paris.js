'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProducts = exports.parseProducts = exports.getNav = exports.makeUrl = exports.HOST = undefined;

var _helpers = require('../helpers');

var HOST = exports.HOST = 'http://www.paris.cl';
var SEARCH_URL = HOST + '/webapp/wcs/stores/servlet/AjaxCatalogSearchResultView';

var makeUrl = exports.makeUrl = function makeUrl() {
  var page = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
  var qty = arguments.length <= 1 || arguments[1] === undefined ? 90 : arguments[1];
  var search = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
  return SEARCH_URL + '?storeId=10801' + ('&pageSize=' + qty + '&beginIndex=' + (page - 1) * qty + '&sType=SimpleSearch&searchTerm=' + search);
};

var getNav = exports.getNav = function getNav($, res) {
  var nav = $('.paging ul').first();
  var current = nav.find('.selected');

  var checkElem = function checkElem(elem) {
    if (elem.attr('style')) return null;
    var match = $(elem).children('a').attr('onclick').match(/goToResultPage\('(.+?)',/);
    return match ? match[1] : null;
  };

  var prev = checkElem(current.prev());
  var next = checkElem(current.next());

  return {
    prev: prev || null,
    current: HOST + res.request.path,
    next: next || null
  };
};

var parseProducts = exports.parseProducts = function parseProducts(_ref) {
  var $ = _ref.$;
  var res = _ref.res;
  var body = _ref.body;

  var elems = $('.item_container > .item');

  var nav = getNav($, res);
  var products = elems.map(function (i, elem) {
    var link = $(elem).find('.description_fixedwidth > a').attr('href');
    var img = $(elem).find('.img img').attr('src');
    var name = $(elem).find('.description_fixedwidth > a').text();
    var price = $(elem).find('.offerPrice').text();

    return {
      name: (0, _helpers.cleanText)(name),
      price: (0, _helpers.cleanPrice)(price),
      link: link,
      img: img
    };
  }).get();

  return { products: products, nav: nav, res: res, body: body };
};

var getProducts = exports.getProducts = function getProducts(page, qty, search) {
  return (0, _helpers.getDOM)(makeUrl(page, qty, search)).then(parseProducts);
};