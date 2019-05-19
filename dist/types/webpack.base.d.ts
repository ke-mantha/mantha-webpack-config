/// <reference types="webpack-dev-server" />
import { Configuration } from 'webpack';
import * as webpack from 'webpack';
export declare const webpackBaseConfigFactory: (baseConfig: IBaseConfig) => Configuration;
export interface IBaseConfig {
    mode: 'development' | 'production';
    htmlConfigFactory: (mode: IBaseConfig['mode']) => any;
    chunkSplitPatterns: RegExp[];
    projectPath: string;
    configJsonPath?: string;
    buildPath?: string;
    activePackage?: 'vue' | 'lit';
    customConfiguration?: webpack.Configuration;
    ignoreFavicons?: boolean;
}
