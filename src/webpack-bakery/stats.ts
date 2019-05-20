export default {
  cachedAssets: false,
  performance: true,
  modules: false,
  colors: true,

  env: true,
  version: false,
  children: false,
  chunkOrigins: true,
  chunksSort: 'size',
  assetsSort: 'size',
  modulesSort: 'size',

  excludeAssets(name: string) {
    const excludeFromLogs = [/assets/, /static/, /favicon/, /webpack-silent/];

    return excludeFromLogs.some(r => r.test(name));
  }
}
