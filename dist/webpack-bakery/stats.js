"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
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
    excludeAssets: function (name) {
        var excludeFromLogs = [/assets/, /static/, /favicon/, /webpack-silent/];
        return excludeFromLogs.some(function (r) { return r.test(name); });
    }
};
//# sourceMappingURL=stats.js.map