"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var defaults_1 = require("./defaults");
function safePush(arr) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
        var value = values_1[_a];
        if (typeof value === 'object' && value !== null) {
            arr.push(value);
        }
    }
}
exports.safePush = safePush;
exports.createResolver = function (projectPath) { return function (dir) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return path_1.join.apply(void 0, [projectPath, dir].concat(args));
}; };
function generatePaths(_a, resolve) {
    var configJsonPath = _a.configJsonPath;
    var tspaths = {};
    if (configJsonPath) {
        try {
            tspaths = require(configJsonPath).compilerOptions.paths;
        }
        catch (error) {
            tspaths = {};
        }
    }
    return Object.keys(tspaths).reduce(function (obj, key) {
        obj[key.replace('/*', '')] = resolve('src/' + tspaths[key][0].replace('/*', '').replace('./', ''));
        return obj;
    }, {});
}
exports.generatePaths = generatePaths;
function getActivePackage(customPackageName) {
    if (!customPackageName) {
        return undefined;
    }
    if (!defaults_1.packageNameRegExp.test(customPackageName)) {
        console.error("Package names must start with \"package-\"");
        console.error("Package \"@mantha/" + customPackageName + "\" not found.");
        return undefined;
    }
    console.info("Searching for \"@mantha/" + customPackageName + "...\"");
    try {
        return require("@mantha/" + customPackageName);
    }
    catch (error) {
        console.error("Package \"@mantha/" + customPackageName + "\" not found.", error);
    }
}
exports.getActivePackage = getActivePackage;
function getPackageConfig(mode, activePackage) {
    var f = (getActivePackage(activePackage) || defaults_1.defaultPackage() || defaults_1.emptyPackage).webpackConfigurationFactory;
    return f(mode);
}
exports.getPackageConfig = getPackageConfig;
//# sourceMappingURL=util.js.map