/// <reference types="webpack-dev-server" />
import { Configuration, Plugin } from 'webpack';
import { Options as HTMLOptions } from 'html-webpack-plugin';
export declare type ManthaMode = 'development' | 'production';
export declare type Resolver = (dir: string, ...args: string[]) => string;
export interface IBaseConfig {
    projectPath: string;
    mode: ManthaMode;
    htmlConfigFactory: (mode: ManthaMode) => HTMLOptions;
    chunkSplitPatterns?: RegExp[];
    configJsonPath?: string;
    sourcePath?: string;
    buildPath?: string;
    publicPath?: string;
    activePackage?: string;
    customConfiguration?: Configuration;
    generateFavicons?: boolean;
    enableStats?: boolean;
}
export interface IDoughConfig {
    mode: ManthaMode;
    projectPath: string;
    chunkSplitPatterns: RegExp[];
    aliases: Aliases;
    sourcePath: string;
    buildPath: string;
    outputPath: string;
    publicPath: string;
    activePackageConfiguration?: Configuration;
    customConfiguration?: Configuration;
    generateFavicons: boolean;
    enableStats: boolean;
    additionalPlugins: Plugin[];
    htmlConfig: HTMLOptions;
    resolve: Resolver;
}
export interface IPackagePreset {
    webpackConfigurationFactory: (mode: ManthaMode) => Configuration | undefined;
}
export declare type Aliases = {
    [name: string]: string;
};
