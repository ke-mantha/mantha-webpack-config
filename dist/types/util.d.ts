/// <reference types="webpack" />
/// <reference types="webpack-dev-server" />
import { IBaseConfig, Aliases, IPackagePreset, Resolver, ManthaMode } from './types';
export declare function safePush<T extends Array<any>>(arr: T, ...values: any[]): void;
export declare const createResolver: (projectPath: string) => Resolver;
export declare function generatePaths({ configJsonPath }: IBaseConfig, resolve?: ReturnType<typeof createResolver>): Aliases;
export declare function getActivePackage(customPackageName?: string): IPackagePreset | undefined;
export declare function getPackageConfig(mode: ManthaMode, activePackage?: string): import("webpack").Configuration | undefined;
