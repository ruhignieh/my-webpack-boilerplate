/*
 * @Descripttion: 创建小程序Page Component工具
 * @file: script/index
 * @module: script/index
 * @version: 1.0.0
 * @Author: Ruhig Nieh
 * @Date: 2020-06-04 14:13:03
 * @LastEditors: Ruhig Nieh
 * @LastEditTime: 2020-06-04 15:25:06
 */ 
const yargs =  require('yargs');
const { createBuilder, createHandler } = require('./create');
const pkg = require('../package.json');
const {version} = pkg;
const updateNotifier = require('update-notifier');
const { dir, init } = require('./config');
const opn = require('opn');

const app = async () => {
	// eslint-disable-next-line
	const argv = yargs
		.usage('\n create-wxapp-page <command> [args]')
		.command({
			command: ['create', '*'],
			builder: createBuilder,
			handler: createHandler,
			desc: '创建page或者compnent',
		})
		.command({
			command: 'reset',
			handler: init,
			desc: '重置模板'
		})
		.command({
			command: 'open',
			handler: () => opn(dir, { wait: false }),
			desc: '打开模板目录'
		})
		.command({
			command: 'dir',
			handler: () => console.log(dir),
			desc: '显示模板目录位置'
		})
		.alias('h', 'help')
		.alias('v', 'version')
		.help()
		.version(version)
		.argv;
};

app().catch((err) => console.error('[错误]', err.message));
updateNotifier({ pkg }).notify();