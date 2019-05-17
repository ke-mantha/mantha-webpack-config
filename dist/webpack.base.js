import { join } from 'path';
import { readdirSync } from 'fs';
import { existsSync, mkdirSync } from 'fs';
import merge from 'webpack-merge';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as cleanWebpackPlugin from 'clean-webpack-plugin';
import * as ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin/lib';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as webpack from 'webpack';
let activePackagePreset = null;
try {
    let fileName = readdirSync(join(__dirname, '../../@mantha')).find(fn => /package-(vue|lit)/.test(fn));
    activePackagePreset = require(`@mantha/${fileName}`);
}
catch (error) {
    console.error(`No mantha preset package is installed.`);
}
export const webpackBaseConfigFactory = (baseConfig) => {
    function resolve(dir, ...args) {
        return join(baseConfig.projectPath, dir, ...args);
    }
    var paths;
    try {
        paths = require(baseConfig.configJsonPath).compilerOptions.paths;
    }
    catch (error) {
        paths = {};
    }
    paths = Object.keys(paths).reduce((obj, key) => {
        obj[key.replace('/*', '')] = resolve('src/' + paths[key][0].replace('/*', '').replace('./', ''));
        return obj;
    }, {});
    const htmlConfig = baseConfig.htmlConfigFactory(baseConfig.mode);
    htmlConfig.favicon && (htmlConfig.favicon = resolve('src/' + htmlConfig.favicon));
    const buildPath = resolve(baseConfig.buildPath || 'build');
    const buildExist = existsSync(resolve(buildPath));
    const additionalPlugins = [];
    if (!buildExist) {
        mkdirSync(resolve(buildPath));
    }
    if (!baseConfig.ignoreFavicons) {
        const faviconsExist = existsSync(resolve(buildPath, 'favicons'));
        if (!faviconsExist) {
            mkdirSync(resolve(buildPath, 'favicons'));
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
            activePackagePreset = require(`@mantha/package-${baseConfig.activePackage}`);
        }
        catch (error) {
            console.error(`Package "@mantha/package-${baseConfig.activePackage}" not found.`, error);
        }
    }
    const packageConfiguration = activePackagePreset ? (activePackagePreset.webpackConfigurationFactory ? activePackagePreset.webpackConfigurationFactory(baseConfig.mode) : {}) : {};
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
            excludeAssets(name) {
                const excludeFromLogs = [/assets/, /static/, /favicon/, /webpack-silent/];
                return excludeFromLogs.some(r => r.test(name));
            }
        },
        resolve: {
            extensions: ['.ts', '.js', '.css', '.json'],
            alias: Object.assign({}, paths)
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
                        test: chunk => (baseConfig.chunkSplitPatterns.every(p => !p.test(chunk.userRequest) && !p.test(chunk._chunks.values().next().value.name))),
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
            new HtmlWebpackPlugin(Object.assign({}, htmlConfig, { template: require('html-webpack-template'), inject: false, favicon: htmlConfig.favicon, title: htmlConfig.title, meta: htmlConfig.meta, env: { NODE_ENV: baseConfig.mode, ENV: baseConfig.mode }, minify: baseConfig.mode === 'production' ? {
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
            new webpack.NamedModulesPlugin(),
            ...additionalPlugins
        ],
        node: { __dirname: true }
    }, packageConfiguration, baseConfig.customConfiguration || {});
};
//# sourceMappingURL=webpack.base.js.map