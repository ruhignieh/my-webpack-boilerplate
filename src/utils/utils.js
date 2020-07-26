/**
 * 函数节流
 * @param fn 需要进行节流操作的事件函数
 * @param interval 间隔时间
 * @returns {Function}
 */
function throttle(fn, interval = 500) {
  let enterTime = 0;
  const gapTime = interval;
  return function () {
    const context = this;
    const backTime = new Date();
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments[0]);
      enterTime = backTime;
    }
  };
}

/**
 * 函数防抖
 * @param fn 需要进行防抖操作的事件函数
 * @param interval 间隔时间
 * @returns {Function}
 */
// eslint-disable-next-line no-magic-numbers
function debounce(fn, interval = 1000) {
  let timer;
  const gapTime = interval;
  return function () {
    clearTimeout(timer);
    const context = this;
    const args = arguments[0];
    timer = setTimeout(function () {
      fn.call(context, args);
    }, gapTime);
  };
}

/**
 * 格式化URL
 * @param url url格式
 * @returns {Object}
 */
function parseUrl(url) {
  const parse = {};
  const urlData = url.split("?")[1]; // 获取url参数
  if (urlData) {
    const urlArr = urlData.split("&");
    urlArr.forEach((item) => {
      const [key, val] = item.split("=");
      parse[key] = val;
    });
  }
  return parse;
}

const promisoryMy = (fn) => {
  if (typeof fn !== "function") {
    return fn;
  }
  return (args = {}) => {
    // 这个api的参数不是对象，直接返回方法（参数）
    if (typeof args !== "object") {
      return fn(args);
    }
    // 这个api是有sussess和fail这样子的回调函数 就有promise方法
    return new Promise((resolve, reject) => {
      args.success = resolve;
      args.fail = reject;
      fn(args);
    });
  };
};

const cacheImage = (url) => {
  const activeDownloadFile = promisoryMy(my.downloadFile);
  return new Promise((resolve, reject) => {
    activeDownloadFile({ url })
      .then((res) => {
        const fs = my.getFileSystemManager();
        fs.saveFile({
          tempFilePath: res.apFilePath,
          success(r) {
            resolve(r);
          },
          fail(e) {
            reject(e);
          },
        });
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export { throttle, debounce, parseUrl, promisoryMy, cacheImage };

export default {
  throttle,
  debounce,
  parseUrl,
  promisoryMy,
  cacheImage,
};
