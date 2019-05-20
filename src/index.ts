import { IBaseConfig } from './types';
import * as Bakery from './webpack-bakery';

export const webpackBaseConfigFactory = (base: IBaseConfig) => {
  const dough = Bakery.cookDough(base);

  return Bakery.bakeBaseConfig(dough);
};

export { IBaseConfig, IPackagePreset, ManthaMode } from './types';
export { packageNameRegExp } from './defaults';
