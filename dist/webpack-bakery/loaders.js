"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (resolve, sourcePath) { return [
    {
        test: [/\.d\.ts$/, /[t|j]sconfig.*\.json$/],
        loader: 'ignore-loader'
    },
    {
        test: /\.ts$/,
        exclude: [/(\.d\.ts)/],
        loader: 'ts-loader',
        options: {
            configFile: resolve(sourcePath, 'tsconfig.json'),
            transpileOnly: true
        }
    },
    {
        test: /\.js?$/,
        exclude: [/node_modules/],
        loader: 'babel-loader'
    },
    {
        test: /\.(woff(2)?|eot|ttf|otf|)$/,
        loader: 'file-loader',
        options: {
            name: 'static/[name].[ext]'
        }
    },
    {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: 'static/[name].[ext]'
                }
            }
        ]
    }
]; });
//# sourceMappingURL=loaders.js.map