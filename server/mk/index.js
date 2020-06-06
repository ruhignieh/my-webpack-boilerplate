/*
 * @Descripttion: MK云函数
 * @file: server/mk
 * @module: MK
 * @version: 1.0.0
 * @Author: Ruhig Nieh
 * @Date: 2020-05-21 11:12:37
 * @LastEditors: Ruhig Nieh
 * @LastEditTime: 2020-06-05 14:34:08
 */

const { v4: uuidv4 } = require('uuid');

exports.main = async () => {
  // console.log(uuidv4());
  // console.log(process.env.MKdomain);
  return 'hello world' + uuidv4();
};

exports.generateId = async () => {
  return uuidv4();
};

exports.getDetail = async (context) => {
  try {
    const result = await context.cloud.httpApi.invoke({
      domain: process.env.MKdomain,
      path: `/api/external/mk/sku/${context.data.id}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });
    const getRes = JSON.parse(result);
    if (getRes.flag === 10) {
      return { success: true, result: JSON.parse(result) };
    } else {
      return { success: false, result: JSON.parse(result) };
    }
  } catch (e) {
    return {
      success: false,
      result: e,
    };
  }
};

exports.saveDesign = async (context) => {
  const currentTime = new Date().getTime();
  try {
    const data = context.data;
    const result = await context.cloud.httpApi.invoke({
      domain: process.env.MKdomain,
      path: '/api/external/mk/savedesign',
      method: 'GET',
      params: data,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });
    const getRes = JSON.parse(result);
    if (getRes.flag === 10) {
      return { success: true, result: JSON.parse(result), time: currentTime };
    } else {
      return { success: false, result: JSON.parse(result), time: currentTime };
    }
  } catch (e) {
    return {
      success: false,
      result: e,
      time: currentTime,
    };
  }
};

exports.designPreview = async (context) => {
  try {
    const data = context.data;
    const result = await context.cloud.httpApi.invoke({
      domain: process.env.MKdomain,
      path: `/api/tmall/preview/${context.data.id}`,
      method: 'GET',
      params: data.params,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });
    const getRes = JSON.parse(result);
    if (getRes.flag === 10) {
      return { success: true, result: JSON.parse(result) };
    } else {
      return { success: false, result: JSON.parse(result) };
    }
  } catch (e) {
    return {
      success: false,
      result: e,
    };
  }
};

exports.getPreviewFileURL = async () => {
  return 'https://m.duanqu.com?_ariver_appid=3000000002164125&nbsv=0.0.65&nbsource=debug&nbsn=TRIAL&page=pages%2fpreview%2fpreview';
};
