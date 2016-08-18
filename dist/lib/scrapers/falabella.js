'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProducts = exports.parseProducts = exports.getNav = exports.makeUrl = exports.HOST = undefined;

var _helpers = require('../helpers');

var HOST = exports.HOST = 'http://www.falabella.com';
var SEARCH_URL = HOST + '/falabella-cl/search/';

var makeUrl = exports.makeUrl = function makeUrl() {
  var page = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
  var qty = arguments.length <= 1 || arguments[1] === undefined ? 16 : arguments[1];
  var search = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
  return SEARCH_URL + '?&No=' + (page - 1) * qty + ('&Ntt=' + search + '&Nrpp=' + qty + '&userSelectedFormat=list');
};

var getNav = exports.getNav = function getNav($) {
  var nav = $('#paginador').first();
  var current = nav.find('.destacadoLista');
  var prev = (0, _helpers.cleanText)(current.prev().text());
  var next = (0, _helpers.cleanText)(current.next().text());

  return {
    prev: prev || null,
    current: (0, _helpers.cleanText)(current.text()),
    next: next || null
  };
};

var parseProducts = exports.parseProducts = function parseProducts(_ref) {
  var $ = _ref.$;
  var res = _ref.res;
  var body = _ref.body;

  var elems = $('#contenedorInterior .cajaLP1x');

  var nav = getNav($);
  var products = elems.map(function (i, elem) {
    if ($(elem).html().length < 10) return null;

    var link = $(elem).find('.detalle > a').attr('href');
    var img = $(elem).find('img[data-original]').attr('data-original');
    var name = $(elem).find('.detalle').text();
    var brand = $(elem).find('.marca').text();
    var price = $(elem).find('.precio1 span').text();

    return {
      name: (0, _helpers.cleanText)(name),
      price: (0, _helpers.cleanPrice)(price),
      brand: (0, _helpers.cleanText)(brand),
      link: HOST + link,
      img: img
    };
  }).get();

  return { products: products, nav: nav, res: res, body: body };
};

var getProducts = exports.getProducts = function getProducts(page, qty, search) {
  return (0, _helpers.getDOM)(makeUrl(page, qty, search)).then(parseProducts);
};