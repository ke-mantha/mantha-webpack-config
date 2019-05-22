import { join } from 'path';
import { IBaseConfig, Aliases, IPackagePreset, Resolver, ManthaMode } from './types';
import { defaultPackage, emptyPackage, packageNameRegExp } from './defaults';

export function safePush<T extends Array<any>>(arr: T, ...values: any[]) {
  for (const value of values) {
    if (typeof value === 'object' && value !== null) {
      arr.push(value);
    }
  }
}

export const createResolver = (
  projectPath: string
): Resolver => (dir: string, ...args: string[]) => join(projectPath, dir, ...args);

export function generatePaths(
  { configJsonPath }: IBaseConfig,
  resolve: ReturnType<typeof createResolver> = (...args) => join(...args)
): Aliases {
  let tspaths: Aliases = {};

  if (configJsonPath) {
    try {
      tspaths = require(configJsonPath).compilerOptions.paths
    } catch (error) {
      tspaths = {}
    }
  }

  return Object.keys(tspaths).reduce((obj, key) => {
    obj[key.replace('/*', '')] = resolve('src', tspaths[key][0].replace('/*', ''));

    return obj;
  }, {});
}

export function getActivePackage(customPackageName?: string): IPackagePreset | undefined {
  if (!customPackageName) {
    return undefined;
  }

  if (!packageNameRegExp.test(customPackageName)) {
    console.error(`Package names must start with "package-"`);
    console.error(`Package "@mantha/${customPackageName}" not found.`);
    return undefined;
  }

  console.info(`Searching for "@mantha/${customPackageName}..."`);

  try {
    return require(`@mantha/${customPackageName}`);
  } catch (error) {
    console.error(`Package "@mantha/${customPackageName}" not found.`, error);
  }
}

export function getPackageConfig(mode: ManthaMode, activePackage?: string) {
  const {
    webpackConfigurationFactory: f
  }: IPackagePreset = getActivePackage(activePackage) || defaultPackage() || emptyPackage;

  return f(mode);
}
