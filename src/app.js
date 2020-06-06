/*
 * @Descripttion: 
 * @file: 
 * @module: 
 * @version: 1.0.0
 * @Author: Ruhig Nieh
 * @Date: 2020-06-01 16:25:51
 * @LastEditors: Ruhig Nieh
 * @LastEditTime: 2020-06-03 16:27:58
 */ 
// import request from './utils/cloud';
// import { Cloud } from '@tbmp/mp-cloud-sdk';

// const cloud = new Cloud();

// cloud.init({ env: 'test' }); // test pre online
// import './app.less';

App({
  // cloud,
  globalData: {
    itemId: '',
    skuId: '',
    tradeToken: '',
    tradeExToken: '',
    mixUserId: ''
  },
  onLaunch() {
    // options
    // console.info('App onLaunch');
    // console.log(options);
    // this.request = this.ajax();
    // this.getToken = this.request.init();
    // const { query = {} } = options;
    // const { params = {} } = query;
    // const paramJson = JSON.parse(params);
    // this.globalData.tradeToken = paramJson.tradeToken;
    // this.globalData.tradeExToken = paramJson.tradeExToken;
    // this.globalData.itemId = paramJson.itemId;
    // this.globalData.skuId = paramJson.skuId;
    // if (!paramJson.tradeToken && !paramJson.tradeExToken) {
    //   my.alert({
    //     title: '流程异常',
    //     content: '请从商品详情打开小程序'
    //   });
    //   return;
    // }
  },
  onShow() {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
  ajax() {
    // return new request(cloud);
  }
});
