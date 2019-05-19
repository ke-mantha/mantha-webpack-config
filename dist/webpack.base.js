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
var path_1 = require("path");
var fs_1 = require("fs");
var fs_2 = require("fs");
var merge = require("webpack-merge");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var cleanWebpackPlugin = require("clean-webpack-plugin");
var ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin/lib");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var webpack = require("webpack");
var activePackagePreset = null;
try {
    var fileName = fs_1.readdirSync(path_1.join(__dirname, '../../@mantha')).find(function (fn) { return /package-(vue|lit)/.test(fn); });
    activePackagePreset = require("@mantha/" + fileName);
}
catch (error) {
    console.error("No mantha preset package is installed.");
}
exports.webpackBaseConfigFactory = function (baseConfig) {
    function resolve(dir) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return path_1.join.apply(void 0, [baseConfig.projectPath, dir].concat(args));
    }
    var paths = {};
    if (baseConfig.configJsonPath) {
        try {
            paths = require(baseConfig.configJsonPath).compilerOptions.paths;
        }
        catch (error) {
            paths = {};
        }
    }
    paths = Object.keys(paths).reduce(function (obj, key) {
        obj[key.replace('/*', '')] = resolve('src/' + paths[key][0].replace('/*', '').replace('./', ''));
        return obj;
    }, {});
    var htmlConfig = baseConfig.htmlConfigFactory(baseConfig.mode);
    htmlConfig.favicon && (htmlConfig.favicon = resolve('src/' + htmlConfig.favicon));
    var buildPath = resolve(baseConfig.buildPath || 'build');
    var buildExist = fs_2.existsSync(resolve(buildPath));
    var additionalPlugins = [];
    if (!buildExist) {
        fs_2.mkdirSync(resolve(buildPath));
    }
    if (!baseConfig.ignoreFavicons) {
        var faviconsExist = fs_2.existsSync(resolve(buildPath, 'favicons'));
        if (!faviconsExist) {
            fs_2.mkdirSync(resolve(buildPath, 'favicons'));
        }
        additionalPlugins.push(new CopyWebpackPlugin([
            {
                from: resolve(buildPath, 'favicons'),
                to: resolve('favicons')
            }
        ]));
    }
    if (baseConfig.activePackage) {
        try {
            activePackagePreset = require("@mantha/package-" + baseConfig.activePackage);
        }
        catch (error) {
            console.error("Package \"@mantha/package-" + baseConfig.activePackage + "\" not found.", error);
        }
    }
    var packageConfiguration = activePackagePreset ? (activePackagePreset.webpackConfigurationFactory ? activePackagePreset.webpackConfigurationFactory(baseConfig.mode) : {}) : {};
    return merge({
        mode: baseConfig.mode,
        output: {
            path: resolve(buildPath, baseConfig.mode),
            publicPath: '/'
        },
        stats: {
            cachedAssets: false,
            performance: true,
            modules: false,
            colors: true,
            env: true,
            version: false,
            children: false,
            chunkOrigins: true,
            chunksSort: 'size',
            assetsSort: 'size',
            modulesSort: 'size',
            excludeAssets: function (name) {
                var excludeFromLogs = [/assets/, /static/, /favicon/, /webpack-silent/];
                return excludeFromLogs.some(function (r) { return r.test(name); });
            }
        },
        resolve: {
            extensions: ['.ts', '.js', '.css', '.json'],
            alias: __assign({}, paths)
        },
        module: {
            noParse: /.*[t|j]sconfig\.json$/,
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        (baseConfig.mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader'),
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: baseConfig.mode === 'development',
                                minimize: baseConfig.mode === 'production'
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: [
                                    require('autoprefixer')
                                ]
                            }
                        },
                    ],
                    include: [/.*src\/themes\/.*/, /node_modules/],
                    exclude: [/.*src\/components.*/, /.*src\/pages.*/]
                },
                {
                    test: [/\.d\.ts$/, /tsconfig.*\.json$/],
                    loader: 'ignore-loader'
                },
                {
                    test: /\.ts$/,
                    exclude: [/(\.d\.ts)/],
                    loader: 'ts-loader',
                    options: {
                        configFile: resolve('./src/tsconfig.json'),
                        transpileOnly: true
                    }
                },
                {
                    test: /\.js?$/,
                    exclude: [/node_modules/],
                    loader: 'babel-loader'
                },
                {
                    test: /\.(woff(2)?|eot|ttf|otf|)$/,
                    loader: 'file-loader',
                    options: {
                        name: 'static/[name].[ext]'
                    }
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'static/[name].[ext]'
                            }
                        }
                    ]
                }
            ]
        },
        optimization: {
            mergeDuplicateChunks: true,
            flagIncludedChunks: true,
            removeAvailableModules: true,
            removeEmptyChunks: true,
            runtimeChunk: {
                name: 'async-importer'
            },
            nodeEnv: baseConfig.mode,
            namedChunks: true,
            splitChunks: {
                maxInitialRequests: 20,
                maxAsyncRequests: 20,
                cacheGroups: {
                    vendor: {
                        test: /node_modules/,
                        chunks: 'all',
                        enforce: true,
                        reuseExistingChunk: true,
                        name: true
                    },
                    main: {
                        test: function (chunk) { return (baseConfig.chunkSplitPatterns.every(function (p) { return !p.test(chunk.userRequest) && !p.test(chunk._chunks.values().next().value.name); })); },
                        chunks: 'all',
                        enforce: true,
                        reuseExistingChunk: true,
                        name: true
                    }
                }
            }
        },
        parallelism: 8,
        plugins: [
            new MiniCssExtractPlugin({
                filename: baseConfig.mode === 'development' ? '[name].css' : '[name].[contenthash].css',
                chunkFilename: baseConfig.mode === 'development' ? '[name].css' : '[name].[contenthash].css',
            }),
            new HtmlWebpackPlugin(__assign({}, htmlConfig, { template: require('html-webpack-template'), inject: false, favicon: htmlConfig.favicon, title: htmlConfig.title, meta: htmlConfig.meta, env: { NODE_ENV: baseConfig.mode, ENV: baseConfig.mode }, minify: baseConfig.mode === 'production' ? {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    collapseBooleanAttributes: true,
                    minifyCSS: true,
                    minifyJS: true
                } : false })),
            new cleanWebpackPlugin(resolve(buildPath, baseConfig.mode), {
                allowExternal: true
            }),
            new ForkTsCheckerWebpackPlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(baseConfig.mode),
                'process.env.ENV': JSON.stringify(baseConfig.mode),
            }),
            new webpack.NamedModulesPlugin()
        ].concat(additionalPlugins),
        node: { __dirname: true }
    }, packageConfiguration, baseConfig.customConfiguration || {});
};
//# sourceMappingURL=webpack.base.js.map