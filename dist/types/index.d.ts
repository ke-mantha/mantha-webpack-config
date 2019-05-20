/// <reference types="webpack" />
/// <reference types="webpack-dev-server" />
import { IBaseConfig } from './types';
export declare const webpackBaseConfigFactory: (base: IBaseConfig) => import("webpack").Configuration;
export { IBaseConfig, IPackagePreset, ManthaMode } from './types';
export { packageNameRegExp } from './defaults';
