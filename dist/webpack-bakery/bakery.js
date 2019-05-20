"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stats_1 = require("./stats");
var extensions_1 = require("./extensions");
var plugins_1 = require("./plugins");
var optimization_1 = require("./optimization");
var loaders_1 = require("./loaders");
function formWebpackBase(_a) {
    var mode = _a.mode, outputPath = _a.outputPath, publicPath = _a.publicPath, sourcePath = _a.sourcePath, buildPath = _a.buildPath, htmlConfig = _a.htmlConfig, additionalPlugins = _a.additionalPlugins, chunkSplitPatterns = _a.chunkSplitPatterns, alias = _a.aliases, enableStats = _a.enableStats, resolve = _a.resolve;
    return {
        mode: mode,
        output: {
            path: outputPath,
            publicPath: publicPath
        },
        stats: enableStats ? stats_1.default : undefined,
        resolve: {
            extensions: extensions_1.default,
            alias: alias
        },
        module: {
            noParse: /.*[t|j]sconfig\.json$/,
            rules: loaders_1.default(resolve, sourcePath).slice()
        },
        optimization: optimization_1.default(mode, chunkSplitPatterns),
        parallelism: 8,
        plugins: plugins_1.default(mode, buildPath, htmlConfig, resolve).concat(additionalPlugins),
        node: { __dirname: true }
    };
}
exports.formWebpackBase = formWebpackBase;
//# sourceMappingURL=bakery.js.map