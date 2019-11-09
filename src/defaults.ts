import { join } from 'path';
import { readdirSync } from 'fs';
import { IPackagePreset } from './types';
import { MergeStrategy } from 'webpack-merge';

export const defaultSourcePath = './src';
export const defaultBuildPath = './build';
export const defaultFaviconsFolder = './favicons';
export const defaultPublicPath = './';
export const defaultEnableStats = true;

export const defaultMergeStrategy: { [field: string]: MergeStrategy } = {
  entry: 'append',
  'module.rules': 'append'
};

export const packageNameRegExp = /package-(\w+)/;
export const defaultPackageName = () => {
  try {
    return readdirSync(join(__dirname, '../../../@mantha')).find(fn => packageNameRegExp.test(fn))
  } catch (error) {
    return;
  }
};

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
