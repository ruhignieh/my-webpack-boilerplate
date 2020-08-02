/*
 * @Descripttion: 
 * @file: 
 * @module: 
 * @version: 1.0.0
 * @Author: Ruhig Nieh
 * @Date: 2020-06-04 14:29:08
 * @LastEditors: Ruhig Nieh
 * @LastEditTime: 2020-07-29 18:21:33
 */ 
import './<%= basename %>.scss';

Page({
    data: {
        title: '<%= basename %>',
    },

    onLoad(params) {
        console.log(params);
    },
});