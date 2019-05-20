import { Configuration, Output, Plugin } from 'webpack';
import { Options as HTMLOptions } from 'html-webpack-plugin';

export type ManthaMode = 'development' | 'production';

export type Resolver = (dir: string, ...args: string[]) => string;

export interface IBaseConfig {
  // Must be an absolute path to root project directory, like `__dirname`
  projectPath: string;

  // Default - production
  mode: ManthaMode;

  // Config factory for HTMLWebpackPlugin
  htmlConfigFactory: (mode: ManthaMode) => HTMLOptions;

  chunkSplitPatterns?: RegExp[];

  // Path to tsconfig.json or jsconfig.json
  configJsonPath?: string;

  // Relative to projectPath
  sourcePath?: string;

  // Relative to projectPath
  buildPath?: string;

  // Relative to buildPath
  publicPath?: string;

  // Name of the active mantha package (@mantha/package-{activePackage})
  activePackage?: string;

  // Custom webpack config
  customConfiguration?: Configuration;

  // Whether to generate favicons automatically
  generateFavicons?: boolean;

  // Whether to enable output statistics
  enableStats?: boolean;
}

export interface IDoughConfig {
  mode: ManthaMode;

  // Absolute
  projectPath: string;

  chunkSplitPatterns: RegExp[];

  // Path aliases extracted from tsconfig or jsconfig
  aliases: Aliases;

  // Absolute
  sourcePath: string;

  // Absolute
  buildPath: string;

  // Absolute
  outputPath: string;

  // Relative to buildPath
  publicPath: string;

  // Config of the active mantha package (@mantha/package-{activePackage})
  activePackageConfiguration?: Configuration;

  // Custom webpack config
  customConfiguration?: Configuration;

  // Whether to generate favicons automatically
  generateFavicons: boolean;

  // Whether to enable output statistics
  enableStats: boolean;

  additionalPlugins: Plugin[];

  htmlConfig: HTMLOptions;

  resolve: Resolver;
}

export interface IPackagePreset {
  webpackConfigurationFactory: (mode: ManthaMode) => Configuration | undefined;
}

export type Aliases = {
  [name: string]: string;
};
