/*
 * @Descripttion: webpack 配置文件
 * @file: webpackConfig
 * @module: webpackConfig
 * @version: 1.0.0
 * @Author: Ruhig Nieh
 * @Date: 2020-06-01 15:35:56
 * @LastEditors: Ruhig Nieh
 * @LastEditTime: 2020-06-05 14:05:53
 */

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const {
    DefinePlugin,
    EnvironmentPlugin,
    IgnorePlugin,
    // BannerPlugin
} = require('webpack');
const WXAppWebpackPlugin = require('wxapp-webpack4-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const GenerateAssetPlugin = require('generate-asset-webpack-plugin');
const pkg = require('../package.json');
const { NODE_ENV, LINT, PT = '' } = process.env;
const isDev = NODE_ENV !== 'production';
const shouldLint = !!LINT && LINT !== 'false';
const Targets = WXAppWebpackPlugin.Targets;

const ABSOLUTE_PATH = process.cwd();
const srcDir = path.resolve(ABSOLUTE_PATH, 'src');

const copyPatterns = []
    .concat(pkg.copyWebpack || [])
    .map(pattern =>
        typeof pattern === 'string' ? { from: pattern, to: pattern } : pattern
    );

// add dependencies
const dependencies = pkg && pkg.dependencies; // dependencies配置
const nodeModulesCopyPath = [];
for (const d in dependencies) {
    nodeModulesCopyPath.push({
        from: path.resolve(ABSOLUTE_PATH, 'node_modules', d),
        to: path.resolve(
            ABSOLUTE_PATH,
            'dist',
            PT.toLowerCase(),
            'node_modules',
            d
        ),
    });
}

const generatePkg = () => {
    return JSON.stringify({ dependencies });
};

module.exports = (env = {}) => {
    const min = env.min;
    const target = env.target || 'Wechat';
    const isWechat = env.target !== 'Alipay';
    const isAlipay = !isWechat;

    const relativeFileLoader = (ext = '[ext]') => {
        return {
            loader: 'file-loader',
            options: {
                // useRelativePath: isWechat,
                name: `[path][name].${ext}`,
                context: srcDir,
            },
        };
    };

    return {
        context: path.resolve(ABSOLUTE_PATH, 'src'),
        mode: NODE_ENV,
        devtool: isDev ? 'source-map' : false,
        entry: {
            app: path.resolve(ABSOLUTE_PATH, 'src/app.js'),
        },
        output: {
            filename: '[name].js',
            publicPath: './',
            path: path.resolve(ABSOLUTE_PATH, 'dist', isWechat ? 'wechat' : 'alipay'),
        },
        target: Targets[target],
        module: {
            rules: [
                {
                    test: /\.json/,
                    exclude: /node_modules/,
                    type: 'javascript/auto',
                    use: [relativeFileLoader('[path][name].[ext]')],
                },
                {
                    test: /\.js$/,
                    include: /src/,
                    exclude: /node_modules/,
                    use: ['babel-loader', shouldLint && 'eslint-loader'].filter(Boolean),
                },
                {
                    test: /\.wxs$/,
                    include: /src/,
                    exclude: /node_modules/,
                    use: [
                        relativeFileLoader(),
                        'babel-loader',
                        shouldLint && 'eslint-loader',
                    ].filter(Boolean),
                },
                {
                    test: /\.(scss|wxss|acss)$/,
                    include: /src/,
                    use: [
                        relativeFileLoader(isWechat ? 'wxss' : 'acss'),
                        {
                            loader: 'sass-loader',
                            options: {
                                sassOptions: {
                                    includePaths: [path.resolve('src', 'styles'), srcDir],
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.(json|png|jpg|gif)$/,
                    include: /src/,
                    use: relativeFileLoader(),
                },
                {
                    test: /\.(wxml|axml)$/,
                    include: /src/,
                    use: [relativeFileLoader(isWechat ? 'wxml' : 'axml')],
                },
            ],
        },
        plugins: [
            new GenerateAssetPlugin({
                filename: 'package.json',
                fn: (compilation, cb) => {
                    cb(null, generatePkg(compilation));
                },
            }),
            new EnvironmentPlugin({
                NODE_ENV,
            }),
            new DefinePlugin({
                __DEV__: isDev,
                __WECHAT__: isWechat,
                __ALIPAY__: isAlipay,
                wx: isWechat ? 'wx' : 'my',
                my: isWechat ? 'wx' : 'my',
            }),
            // eslint-disable-next-line new-cap
            new WXAppWebpackPlugin.default({
                clear: !isDev,
            }),
            new IgnorePlugin(/vertx/),
            shouldLint && new StylelintPlugin(),
            min && new MinifyPlugin(),
            new MiniCssExtractPlugin({ filename: '[name].acss' }),
            // new BannerPlugin({
            //   banner: 'const commons = require("./commons");\nconst runtime = require("./runtime");',
            //   raw: true,
            //   include: 'app.js',
            // }),
            new CopyPlugin(
                { patterns: [...copyPatterns, ...nodeModulesCopyPath] },
                { context: srcDir }
            ),
            new CleanWebpackPlugin(),
        ].filter(Boolean),
        optimization: {
            noEmitOnErrors: true,
            concatenateModules: true,
            // splitChunks: {
            //   cacheGroups: {
            //     commons: {
            //       chunks: 'initial',
            //       name: 'commons',
            //       minSize: 0,
            //       maxSize: 0,
            //       minChunks: 2,
            //     },
            //   },
            // },
            // runtimeChunk: {
            //   name: 'manifest',
            // },
        },
        resolve: {
            modules: [path.resolve(ABSOLUTE_PATH, 'src'), 'node_modules'],
            alias: {
                '@': path.resolve(ABSOLUTE_PATH, 'src'),
                assets: path.resolve(ABSOLUTE_PATH, 'src/assets'),
            },
        },
        watchOptions: {
            ignored: /dist|manifest/,
            aggregateTimeout: 300,
        },
    };
};
