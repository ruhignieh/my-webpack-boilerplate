/*
 * @Descripttion: 工具类脚本配置文件
 * @file: script/config
 * @module: script/config
 * @version: 1.0.0
 * @Author: Ruhig Nieh
 * @Date: 2020-06-04 14:13:03
 * @LastEditors: Ruhig Nieh
 * @LastEditTime: 2020-06-04 15:26:02
 */ 
const { name } = require('../package.json');
const xdgBasedir = require('xdg-basedir');
const fs = require('fs-extra');
const { join } = require('path');

const configPath = xdgBasedir.config;
const dir = join(configPath, name);

const init = () => {
	try {
		fs.copySync(join(__dirname, 'templates'), dir);
		console.log(`[Init Templates Success]: ${dir}`);
	}
	catch (err) {
		console.error(`[Init Templates Error] ${err}`);
	}
};

module.exports= {
  init,
  dir
};