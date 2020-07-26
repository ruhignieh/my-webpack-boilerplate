/*
 * @Descripttion: 
 * @file: 
 * @module: 
 * @version: 1.0.0
 * @Author: Ruhig Nieh
 * @Date: 2020-07-24 10:53:09
 * @LastEditors: Ruhig Nieh
 * @LastEditTime: 2020-07-24 16:26:45
 */ 
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const {
    IgnorePlugin,
} = require('webpack');
const WXAppWebpackPlugin = require('wxapp-webpack4-plugin');
const GenerateAssetPlugin = require('./plugins/generate-asset');
const pkg = require('../package.json');
const { target = '' } = process.env;
const Targets = WXAppWebpackPlugin.Targets;
const isWechat = target !== 'Alipay';

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
            target.toLowerCase(),
            'node_modules',
            d
        ),
    });
}

const generatePkg = () => {
    return JSON.stringify({ dependencies });
};

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

module.exports = {
    context: path.resolve(ABSOLUTE_PATH, 'src'),
    entry: {
        app: path.resolve(ABSOLUTE_PATH, 'src/app.js'),
    },
    output: {
        filename: '[name].js',
        publicPath: '/',
        path: path.resolve(ABSOLUTE_PATH, 'dist', isWechat ? 'wechat' : 'alipay'),
    },
    target: Targets[target],
    module: {
        unknownContextCritical: false,
        rules: [
            {
                test: /\.json/,
                exclude: /node_modules/,
                type: 'javascript/auto',
                use: [relativeFileLoader('json')],
            },
            {
                test: /\.js$/,
                include: /src/,
                exclude: /node_modules/,
                use: ['babel-loader'].filter(Boolean),
            },
            {
                test: /\.wxs$/,
                include: /src/,
                exclude: /node_modules/,
                use: [
                    relativeFileLoader(),
                    'babel-loader'
                ].filter(Boolean),
            },
            {
                test: /\.(scss|wxss|acss)$/,
                include: /src/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
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
                test: /\.(wxml|axml)$/,
                include: /src/,
                use: [
                    relativeFileLoader(isWechat ? 'wxml' : 'axml'),
                    {
                        loader: 'wxml-loader',
                        options: {
                            root: srcDir,
                            enforceRelativePath: false
                        },
                    }
                ],
            },
        ],
    },
    plugins: [
        new GenerateAssetPlugin({
            filename: 'package.json',
            fn(compilation, cb) {
                cb(null, generatePkg(compilation));
            }
        }),
        new IgnorePlugin(/vertx/),
        new MiniCssExtractPlugin({ filename: '[name].acss' }),
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
            '@assets': path.resolve(ABSOLUTE_PATH, 'src/assets'),
        },
    },
    watchOptions: {
        ignored: /dist|manifest/,
        aggregateTimeout: 300,
    },
};
