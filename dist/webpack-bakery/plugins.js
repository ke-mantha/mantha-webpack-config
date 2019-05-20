"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var cleanWebpackPlugin = require("clean-webpack-plugin");
var ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin/lib");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var webpack_1 = require("webpack");
var defaults_1 = require("../defaults");
exports.default = (function (mode, buildPath, htmlConfig, resolve) { return [
    new MiniCssExtractPlugin({
        filename: mode === 'development' ? '[name].css' : '[name].[contenthash].css',
        chunkFilename: mode === 'development' ? '[name].css' : '[name].[contenthash].css',
    }),
    new HtmlWebpackPlugin(__assign({}, htmlConfig, { template: require('html-webpack-template'), inject: false, favicon: htmlConfig.favicon, title: htmlConfig.title, meta: htmlConfig.meta, env: { NODE_ENV: mode, ENV: mode }, minify: mode === 'production' ? {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            collapseBooleanAttributes: true,
            minifyCSS: true,
            minifyJS: true
        } : false })),
    new cleanWebpackPlugin(resolve(buildPath, mode), {
        allowExternal: true
    }),
    new ForkTsCheckerWebpackPlugin(),
    new webpack_1.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.ENV': JSON.stringify(mode),
    }),
    new webpack_1.NamedModulesPlugin(),
]; });
exports.copyFavicons = function (buildPath, resolve) { return new CopyWebpackPlugin([
    {
        from: resolve(buildPath, defaults_1.defaultFaviconsFolder),
        to: resolve(defaults_1.defaultFaviconsFolder)
    }
]); };
//# sourceMappingURL=plugins.js.map