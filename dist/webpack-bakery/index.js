"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var merge = require("webpack-merge");
var util_1 = require("../util");
var bakery_1 = require("./bakery");
var defaults_1 = require("../defaults");
var plugins_1 = require("./plugins");
exports.cookDough = function (baseConfig) {
    var resolve = util_1.createResolver(baseConfig.projectPath);
    var aliases = util_1.generatePaths(baseConfig, resolve);
    var mode = baseConfig.mode;
    var sourcePath = baseConfig.sourcePath || defaults_1.defaultSourcePath;
    var publicPath = baseConfig.publicPath || defaults_1.defaultPublicPath;
    var chunkSplitPatterns = baseConfig.chunkSplitPatterns || defaults_1.defaultChunkSplitPatterns;
    var htmlConfig = baseConfig.htmlConfigFactory && baseConfig.htmlConfigFactory(mode);
    htmlConfig.favicon && (htmlConfig.favicon = resolve(sourcePath, htmlConfig.favicon));
    var buildPath = resolve(baseConfig.buildPath || defaults_1.defaultBuildPath);
    var outputPath = resolve(buildPath, mode);
    var additionalPlugins = [];
    if (baseConfig.generateFavicons) {
        additionalPlugins.push(plugins_1.copyFavicons(buildPath, resolve));
    }
    return {
        mode: mode,
        resolve: resolve,
        sourcePath: sourcePath,
        publicPath: publicPath,
        chunkSplitPatterns: chunkSplitPatterns,
        htmlConfig: htmlConfig,
        buildPath: buildPath,
        outputPath: outputPath,
        aliases: aliases,
        additionalPlugins: additionalPlugins,
        projectPath: baseConfig.projectPath,
        generateFavicons: !!baseConfig.generateFavicons,
        customConfiguration: baseConfig.customConfiguration,
        activePackageConfiguration: util_1.getPackageConfig(mode, baseConfig.activePackage),
        enableStats: typeof baseConfig.enableStats === 'undefined' ? defaults_1.defaultEnableStats : baseConfig.enableStats,
    };
};
exports.bakeBaseConfig = function (doughConfig) {
    var buildPath = doughConfig.buildPath;
    var buildExist = fs_1.existsSync(buildPath);
    if (!buildExist) {
        fs_1.mkdirSync(buildPath);
    }
    if (doughConfig.generateFavicons) {
        var faviconsExist = fs_1.existsSync(path_1.join(buildPath, defaults_1.defaultFaviconsFolder));
        if (!faviconsExist) {
            fs_1.mkdirSync(path_1.join(buildPath, defaults_1.defaultFaviconsFolder));
        }
    }
    var configurations = [
        bakery_1.formWebpackBase(doughConfig)
    ];
    util_1.safePush(configurations, doughConfig.activePackageConfiguration, doughConfig.customConfiguration);
    return merge.apply(void 0, configurations);
};
//# sourceMappingURL=index.js.map