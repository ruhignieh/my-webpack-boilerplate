/*
 * @Descripttion:
 * @file:
 * @module:
 * @version: 1.0.0
 * @Author: Ruhig Nieh
 * @Date: 2020-07-13 10:39:14
 * @LastEditors: Ruhig Nieh
 * @LastEditTime: 2020-07-24 14:18:42
 */
import './index.scss';
// import image from '../../assets/image/logo.png';
// console.log(image);
// console.log(require);
Page({
    events: {
        onKeyboardHeight() {},
    },
    data() {
        return {
            // image,
            title: 'Demo',
        };
    },
    onLoad() {
        console.log('__ALIPAY__:', __ALIPAY__);
    },

    onHide() {},
});
