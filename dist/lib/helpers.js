'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanPrice = exports.cleanText = exports.getDOM = undefined;

var _iconvLite = require('iconv-lite');

var _iconvLite2 = _interopRequireDefault(_iconvLite);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getDOM = exports.getDOM = function getDOM(url) {
  var headers = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  return _axios2.default.get(url, {
    headers: headers,
    responseType: 'arraybuffer'
  }).then(function (res) {
    var decode = res.headers['content-type'] && res.headers['content-type'].toLowerCase().includes('iso-8859-1');

    var body = _iconvLite2.default.decode(res.data, decode ? 'iso-8859-1' : 'utf-8');
    var $ = _cheerio2.default.load(body);

    return { $: $, res: res, body: body };
  });
};

var cleanText = exports.cleanText = function cleanText(text) {
  return text.trim().replace(/[\r\n\t®]/ig, '');
};
var cleanPrice = exports.cleanPrice = function cleanPrice(price) {
  return parseInt(price.replace(/[\$\.]/g, ''), 10);
};