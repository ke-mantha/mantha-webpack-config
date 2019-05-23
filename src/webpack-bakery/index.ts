import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Configuration } from 'webpack';
import * as merge from 'webpack-merge';

import * as webpack from 'webpack';
import { IBaseConfig, IDoughConfig } from '../types';
import { createResolver, generatePaths, getPackageConfig, safePush } from '../util';
import { formWebpackBase } from './bakery';

import {
  defaultBuildPath,
  defaultSourcePath,
  defaultFaviconsFolder,
  defaultPublicPath,
  defaultChunkSplitPatterns,
  defaultEnableStats,
  defaultMergeStrategy
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
    mergeStrategy: typeof baseConfig.mergeStrategy === 'undefined' ? defaultMergeStrategy : baseConfig.mergeStrategy
  };
}

export const bakeBaseConfig = (
  doughConfig: IDoughConfig
): Configuration => {
  const buildPath = doughConfig.buildPath;

  const buildExist = existsSync(buildPath);

  if (!buildExist) {
    mkdirSync(buildPath);
  }

  if (doughConfig.generateFavicons) {
    const faviconsExist = existsSync(join(buildPath, defaultFaviconsFolder));

    if (!faviconsExist) {
      mkdirSync(join(buildPath, defaultFaviconsFolder));
    }
  }

  const configurations: webpack.Configuration[] = [
    formWebpackBase(doughConfig)
  ];

  safePush(configurations,
    doughConfig.activePackageConfiguration,
    doughConfig.customConfiguration
  );

  return merge.strategy(doughConfig.mergeStrategy)(...configurations);
};
