/// <reference types="webpack-dev-server" />
import { Configuration } from 'webpack';
export declare const webpackBaseConfigFactory: (baseConfig: IBaseConfig) => Configuration;
export interface IBaseConfig {
    mode: 'development' | 'production';
    htmlConfigFactory: (mode: IBaseConfig['mode']) => any;
    chunkSplitPatterns: RegExp[];
    projectPath: string;
    buildPath: string;
    configJsonPath: string;
}
