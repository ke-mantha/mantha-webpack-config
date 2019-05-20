import { Configuration } from 'webpack';
import { IDoughConfig } from '../types';
import stats from './stats';
import extensions from './extensions';
import plugins from './plugins';
import optimization from './optimization';
import loaders from './loaders';

export function formWebpackBase(
  {
    mode,
    outputPath,
    publicPath,
    sourcePath,
    buildPath,
    htmlConfig,
    additionalPlugins,
    chunkSplitPatterns,
    aliases: alias,
    enableStats,
    resolve
  }: IDoughConfig
): Configuration {
  return {
    mode,
    output: {
      path: outputPath,
      publicPath
    },
    stats: enableStats ? stats : undefined,

    resolve: {
      extensions,
      alias
    },

    module: {
      noParse: /.*[t|j]sconfig\.json$/,
      rules: [
        ...loaders(resolve, sourcePath)
      ]
    },

    optimization: optimization(mode, chunkSplitPatterns),

    parallelism: 8,

    plugins: [
      ...plugins(mode, buildPath, htmlConfig, resolve),
      ...additionalPlugins
    ],

    node: { __dirname: true }
  };
}
