"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (mode, chunkSplitPatterns) { return ({
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
                test: function (chunk) { return (chunkSplitPatterns.every(function (p) { return !p.test(chunk.userRequest) && !p.test(chunk._chunks.values().next().value.name); })); },
                chunks: 'all',
                enforce: true,
                reuseExistingChunk: true,
                name: true
            }
        }
    }
}); });
//# sourceMappingURL=optimization.js.map