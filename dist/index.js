"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Bakery = require("./webpack-bakery");
exports.webpackBaseConfigFactory = function (base) {
    var dough = Bakery.cookDough(base);
    return Bakery.bakeBaseConfig(dough);
};
var defaults_1 = require("./defaults");
exports.packageNameRegExp = defaults_1.packageNameRegExp;
//# sourceMappingURL=index.js.map