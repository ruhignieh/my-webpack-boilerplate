/*
 * @Descripttion: 
 * @file: 
 * @module: 
 * @version: 1.0.0
 * @Author: Ruhig Nieh
 * @Date: 2020-07-24 10:53:41
 * @LastEditors: Ruhig Nieh
 * @LastEditTime: 2020-07-26 16:44:22
 */ 
const path = require('path');
const {
    DefinePlugin,
    EnvironmentPlugin,
    // BannerPlugin
} = require('webpack');
const WXAppWebpackPlugin = require('wxapp-webpack4-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const WebpackAliOSS = require('./plugins/ali-oss');
const { target = '' } = process.env;

const ABSOLUTE_PATH = process.cwd();
const srcDir = path.resolve(ABSOLUTE_PATH, 'src');
const isWechat = target !== 'Alipay';
const isAlipay = !isWechat;

module.exports = {
    mode: 'production',
    devtool: false,
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
                            name: '[name].[ext]',
                            context: srcDir,
                            publicPath: 'https://event-image-prd.oss-cn-shanghai.aliyuncs.com/img/moet/mina-app/'
                        },
                    }
                ]
            }
        ],
    },
    plugins: [
        new EnvironmentPlugin({
            NODE_ENV: 'production',
        }),
        new DefinePlugin({
            __DEV__: false,
            __WECHAT__: isWechat,
            __ALIPAY__: isAlipay,
            wx: isWechat ? 'wx' : 'my',
            my: isWechat ? 'wx' : 'my',
        }),
        // eslint-disable-next-line new-cap
        new WXAppWebpackPlugin.default({
            clear: true,
        }),
        new MinifyPlugin(),
        false && new WebpackAliOSS({ // 配置oss 地址
            auth: {
                accessKeyId: '', // 在阿里 OSS 控制台获取
                accessKeySecret: '', // 在阿里 OSS 控制台获取
                region: 'oss-cn-shanghai', // OSS 服务节点, 示例: oss-cn-hangzhou
                bucket: '', // OSS 存储空间, 在阿里 OSS 控制台获取
            },
            enableLog: false,
            ossBaseDir: 'img', //OSS 中存放上传文件的一级目录名 
            project: 'moet/mina-app', // 项目名(用于存放文件的直接目录) OSS 中存放上传文件的二级目录, 一般为项目名
            include: /.*\.(png|jpg|gif)$/,
        }),
    ].filter(Boolean)
};
