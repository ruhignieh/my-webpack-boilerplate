import { baseUrl } from "../config";

class request {
  constructor() {
    this._baseUrl = baseUrl;
    this._token = my.getStorageSync("token") || "";
    this._header = { Authorization: "Bearer " + this._token };
  }

  /**
   * GET类型的网络请求
   */
  get(url, data, headers = this._header) {
    return this.ajax(url, data, headers, "GET");
  }

  /**
   * DELETE类型的网络请求
   */
  delete(url, data, header = this._header) {
    return this.ajax(url, data, header, "DELETE");
  }

  /**
   * PUT类型的网络请求
   */
  put(url, data, header = this._header) {
    return this.ajax(url, data, header, "PUT");
  }

  /**
   * POST类型的网络请求
   */
  post(url, data, header = this._header) {
    return this.ajax(url, data, header, "POST");
  }

  /**
   * 网络请求
   */
  ajax(url, data, header, method) {
    return new Promise((resolve, reject) => {
      my.request({
        url: this._baseUrl + url,
        data,
        headers: header,
        method,
        success: (res) => {
          if (res.status === 200) {
            //200: 服务端业务处理正常结束
            resolve(res.data);
          } else {
            //其它错误，提示用户错误信息
            reject(res);
          }
        },
        fail: (res) => {
          reject(res);
        },
      });
    });
  }
}

export default request;
