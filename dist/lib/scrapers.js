'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _casaroyal = require('./scrapers/casaroyal');

var casaroyal = _interopRequireWildcard(_casaroyal);

var _falabella = require('./scrapers/falabella');

var falabella = _interopRequireWildcard(_falabella);

var _olimex = require('./scrapers/olimex');

var olimex = _interopRequireWildcard(_olimex);

var _paris = require('./scrapers/paris');

var paris = _interopRequireWildcard(_paris);

var _pcfactory = require('./scrapers/pcfactory');

var pcfactory = _interopRequireWildcard(_pcfactory);

var _ripley = require('./scrapers/ripley');

var ripley = _interopRequireWildcard(_ripley);

var _sodimac = require('./scrapers/sodimac');

var sodimac = _interopRequireWildcard(_sodimac);

var _spdigital = require('./scrapers/spdigital');

var spdigital = _interopRequireWildcard(_spdigital);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
  casaroyal: casaroyal,
  falabella: falabella,
  olimex: olimex,
  paris: paris,
  pcfactory: pcfactory,
  ripley: ripley,
  sodimac: sodimac,
  spdigital: spdigital
};