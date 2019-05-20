import { ManthaMode } from '../types';
import { Configuration } from 'webpack';

export default (mode: ManthaMode, chunkSplitPatterns: RegExp[]): Configuration['optimization'] => ({
  mergeDuplicateChunks: true,
  flagIncludedChunks: true,
  removeAvailableModules: true,
  removeEmptyChunks: true,
  runtimeChunk: {
    name: 'async-importer'
  },
  nodeEnv: mode,
  namedChunks: true,
  splitChunks: {
    maxInitialRequests: 20,
    maxAsyncRequests: 20,
    cacheGroups: {
      vendor: {
        test: /node_modules/,
        chunks: 'all',
        enforce: true,
        reuseExistingChunk: true,
        name: true
      },
      main: {
        test: chunk => (chunkSplitPatterns.every(p => !p.test(chunk.userRequest) && !p.test(chunk._chunks.values().next().value.name))),
        chunks: 'all',
        enforce: true,
        reuseExistingChunk: true,
        name: true
      }
    }
  }
});
