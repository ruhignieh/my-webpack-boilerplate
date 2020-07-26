/*
 * @Descripttion: 
 * @file: 
 * @module: 
 * @version: 1.0.0
 * @Author: Ruhig Nieh
 * @Date: 2020-07-24 10:53:23
 * @LastEditors: Ruhig Nieh
 * @LastEditTime: 2020-07-24 14:06:58
 */ 
const path = require('path');
const {
    DefinePlugin,
    EnvironmentPlugin,
} = require('webpack');
const WXAppWebpackPlugin = require('wxapp-webpack4-plugin');

const {  target = '' } = process.env;
const ABSOLUTE_PATH = process.cwd();
const srcDir = path.resolve(ABSOLUTE_PATH, 'src');
const isWechat = target !== 'Alipay';
const isAlipay = !isWechat;

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/,
                include: /src/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // useRelativePath: isWechat,
                            name: 'images/[name].[ext]',
                            context: srcDir,
                            publicPath: '../../'
                        },
                    }
                ]
            },
        ],
    },
    plugins: [
        new EnvironmentPlugin({ 
            NODE_ENV: 'development' 
        }),
        new DefinePlugin({
            __DEV__: true,
            __WECHAT__: isWechat,
            __ALIPAY__: isAlipay,
            wx: isWechat ? 'wx' : 'my',
            my: isWechat ? 'wx' : 'my',
        }),
        // eslint-disable-next-line new-cap
        new WXAppWebpackPlugin.default({
            clear: false,
        }),
    ].filter(Boolean),
};
