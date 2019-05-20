import { join } from 'path';
import { readdirSync } from 'fs';
import { IPackagePreset } from './types';

export const defaultSourcePath = './src';
export const defaultBuildPath = './build';
export const defaultFaviconsFolder = './favicons';
export const defaultPublicPath = './';
export const defaultEnableStats = true;

export const packageNameRegExp = /package-(\w+)/;
export const defaultPackageName = () => readdirSync(join(__dirname, '../../@mantha')).find(fn => packageNameRegExp.test(fn));

export function defaultPackage(): IPackagePreset | undefined {
  const name = defaultPackageName();

  console.info(`Searching for "@mantha/${name}..."`);

  try {
    return require(`@mantha/${name}`);
  } catch (error) {
    console.error(`No mantha preset package is installed.`);
  }
}

export const emptyPackage: IPackagePreset = {
  webpackConfigurationFactory: _ => undefined
};

export const defaultChunkSplitPatterns: RegExp[] = [];
