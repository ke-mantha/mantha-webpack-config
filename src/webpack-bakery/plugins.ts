import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as cleanWebpackPlugin from 'clean-webpack-plugin';
import * as ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin/lib';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import { DefinePlugin, NamedModulesPlugin } from 'webpack';

import { ManthaMode, Resolver } from '../types';
import { defaultFaviconsFolder } from '../defaults';

export default (
  mode: ManthaMode,
  buildPath: string,
  htmlConfig: HtmlWebpackPlugin.Options,
  resolve: Resolver
) => [
  new MiniCssExtractPlugin({
    filename: mode === 'development' ? '[name].css' : '[name].[contenthash].css',
    chunkFilename: mode === 'development' ? '[name].css' : '[name].[contenthash].css',
  }),

  new HtmlWebpackPlugin({
    ...htmlConfig,
    template: require('html-webpack-template'),
    inject: false,
    favicon: htmlConfig.favicon,
    title: htmlConfig.title,
    meta: htmlConfig.meta,
    env: { NODE_ENV: mode, ENV: mode },
    minify: mode === 'production' ? {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      collapseBooleanAttributes: true,
      minifyCSS: true,
      minifyJS: true
    } : false
  }),

  new cleanWebpackPlugin(resolve(buildPath, mode), {
    allowExternal: true
  }),

  new ForkTsCheckerWebpackPlugin(),

  new DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(mode),
    'process.env.ENV': JSON.stringify(mode),
  }),

  new NamedModulesPlugin(),
];

export const copyFavicons = (
  buildPath: string,
  resolve: Resolver
) => new CopyWebpackPlugin([
  {
    from: resolve(buildPath, defaultFaviconsFolder),
    to: resolve(defaultFaviconsFolder)
  }
])
