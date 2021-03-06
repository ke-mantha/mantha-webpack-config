import { IPackagePreset } from './types';
import { MergeStrategy } from 'webpack-merge';
export declare const defaultSourcePath = "./src";
export declare const defaultBuildPath = "./build";
export declare const defaultFaviconsFolder = "./favicons";
export declare const defaultPublicPath = "./";
export declare const defaultEnableStats = true;
export declare const defaultMergeStrategy: {
    [field: string]: MergeStrategy;
};
export declare const packageNameRegExp: RegExp;
export declare const defaultPackageName: () => string | undefined;
export declare function defaultPackage(): IPackagePreset | undefined;
export declare const emptyPackage: IPackagePreset;
export declare const defaultChunkSplitPatterns: RegExp[];
