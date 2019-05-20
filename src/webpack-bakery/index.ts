import { existsSync, mkdirSync } from 'fs';
import { Configuration } from 'webpack';
import * as merge from 'webpack-merge';

import * as webpack from 'webpack';
import { IBaseConfig, IDoughConfig } from '../types';
import { createResolver, generatePaths, getPackageConfig, safePush as safePushTo } from '../util';
import { formWebpackBase } from './bakery';

import {
  defaultBuildPath,
  defaultSourcePath,
  defaultFaviconsFolder,
  defaultPublicPath,
  defaultChunkSplitPatterns,
  defaultEnableStats
} from '../defaults';
import { copyFavicons } from './plugins';

export const cookDough =(
  baseConfig: IBaseConfig
): IDoughConfig => {
  const resolve = createResolver(baseConfig.projectPath);
  const aliases = generatePaths(baseConfig, resolve);

  const mode = baseConfig.mode;
  const sourcePath = baseConfig.sourcePath || defaultSourcePath;
  const publicPath = baseConfig.publicPath || defaultPublicPath;
  const chunkSplitPatterns = baseConfig.chunkSplitPatterns || defaultChunkSplitPatterns;

  const htmlConfig = baseConfig.htmlConfigFactory && baseConfig.htmlConfigFactory(mode);
  htmlConfig.favicon && (htmlConfig.favicon = resolve(sourcePath, htmlConfig.favicon));

  const buildPath = resolve(baseConfig.buildPath || defaultBuildPath);
  const outputPath = resolve(buildPath, mode);

  const additionalPlugins: webpack.Plugin[] = [];

  if (baseConfig.generateFavicons) {
    additionalPlugins.push(copyFavicons(buildPath, resolve));
  }

  return {
    mode,
    resolve,
    sourcePath,
    publicPath,
    chunkSplitPatterns,
    htmlConfig,
    buildPath,
    outputPath,
    aliases,
    additionalPlugins,
    projectPath: baseConfig.projectPath,
    generateFavicons: !!baseConfig.generateFavicons,
    customConfiguration: baseConfig.customConfiguration,
    activePackageConfiguration: getPackageConfig(mode, baseConfig.activePackage),
    enableStats: typeof baseConfig.enableStats === 'undefined' ? defaultEnableStats : baseConfig.enableStats,
  };
}

export const bakeBaseConfig = (
  doughConfig: IDoughConfig
): Configuration => {
  const resolve = doughConfig.resolve;
  const buildPath = doughConfig.buildPath;

  const buildExist = existsSync(resolve(buildPath));

  if (!buildExist) {
    mkdirSync(resolve(buildPath));
  }

  if (doughConfig.generateFavicons) {
    const faviconsExist = existsSync(resolve(buildPath, defaultFaviconsFolder));

    if (!faviconsExist) {
      mkdirSync(resolve(buildPath, defaultFaviconsFolder));
    }
  }

  const configurations: webpack.Configuration[] = [
    formWebpackBase(doughConfig)
  ];

  safePushTo(configurations,
    doughConfig.activePackageConfiguration,
    doughConfig.customConfiguration
  );

  return merge(...configurations);
};
