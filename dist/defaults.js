"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_1 = require("fs");
exports.defaultSourcePath = './src';
exports.defaultBuildPath = './build';
exports.defaultFaviconsFolder = './favicons';
exports.defaultPublicPath = './';
exports.defaultEnableStats = true;
exports.packageNameRegExp = /package-(\w+)/;
exports.defaultPackageName = function () { return fs_1.readdirSync(path_1.join(__dirname, '../../@mantha')).find(function (fn) { return exports.packageNameRegExp.test(fn); }); };
function defaultPackage() {
    var name = exports.defaultPackageName();
    console.info("Searching for \"@mantha/" + name + "...\"");
    try {
        return require("@mantha/" + name);
    }
    catch (error) {
        console.error("No mantha preset package is installed.");
    }
}
exports.defaultPackage = defaultPackage;
exports.emptyPackage = {
    webpackConfigurationFactory: function (_) { return undefined; }
};
exports.defaultChunkSplitPatterns = [];
//# sourceMappingURL=defaults.js.map