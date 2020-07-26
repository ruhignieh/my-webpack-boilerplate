/*
 * @Descripttion: webpack 配置文件
 * @file: webpackConfig
 * @module: webpackConfig
 * @version: 1.0.0
 * @Author: Ruhig Nieh
 * @Date: 2020-06-01 15:35:56
 * @LastEditors: Ruhig Nieh
 * @LastEditTime: 2020-07-24 13:47:29
 */
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');
const developmentConfig = require('./webpack.dev');
const productionConfig = require('./webpack.prod');

const { NODE_ENV } = process.env;

module.exports = () => {
    switch (NODE_ENV) {
        case 'development':
            return merge(commonConfig, developmentConfig);
        case 'production':
            return merge(commonConfig, productionConfig);
        default:
            throw new Error('No matching configuration was found!');
    }
};
