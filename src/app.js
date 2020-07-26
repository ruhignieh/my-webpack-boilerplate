/*
 * @Descripttion:
 * @file:
 * @module:
 * @version: 1.0.0
 * @Author: Ruhig Nieh
 * @Date: 2020-07-13 10:39:14
 * @LastEditors: Ruhig Nieh
 * @LastEditTime: 2020-07-23 14:55:07
 */

import Request from '@/utils/cloud';
import { Cloud } from '@tbmp/mp-cloud-sdk';
import './app.scss';

const cloud = new Cloud();

cloud.init({ env: 'online' }); // test pre online

App({
    cloud,
    globalData: {
        itemId: '',
        skuId: '',
        tradeToken: '',
        tradeExToken: '',
        mixUserId: '',
    },
    onLaunch(options) {
        this.request = this.ajax();
        this.getToken = this.request.init();
        console.info('App onLaunch');
        console.log(options);
        const { query = {} } = options;
        const { params = {} } = query;
        const paramJson = JSON.parse(params);
        this.globalData.tradeToken = paramJson.tradeToken;
        this.globalData.tradeExToken = paramJson.tradeExToken;
        this.globalData.itemId = paramJson.itemId;
        this.globalData.skuId = paramJson.skuId;
    // if (!paramJson.tradeToken && !paramJson.tradeExToken) {
    //   my.alert({
    //     title: "流程异常",
    //     content: "请从商品详情打开小程序"
    //   });
    //   return;
    // }
    },
    onShow() {},
    ajax() {
        return new Request(cloud);
    },
});
