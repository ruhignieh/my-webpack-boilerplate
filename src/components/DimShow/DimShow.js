import { downloadFile, getImageInfo, sequenceTasks } from '/utils/utils';
import { getcanvassize } from './utils';

let systemInfo = { windowWidth: 300, windowHeight: 360 };
// eslint-disable-next-line no-sparse-arrays
let [context, timer, movex, movey, timeStamp6ab, stagesizetmp, stagesizetmpn, scale] = [
  '',
  0,
  0,
  0,
  0,
  ,
  0,
  1
];
let [errNum, errMsg] = [0, ''];

Component({
  mixins: [],
  data() {
    return {
      picsrcs: [],
      itmp: 1,
      stmp: 0,
      canvasWidth: 300,
      canvasHeight: 150,
      xWidth: '100%',
      xHeight: 'auto',
      picinfo: { errMsg, width: 300, height: 360, type: '', path: '', orientation: '' }
    };
  },
  props: {
    width: '100%',
    height: 'auto',
    autoplay: false,
    moveFre: 16,
    bgimg: '',
    view: 360,
    src: []
  },
  didMount() {
    systemInfo = my.getSystemInfoSync();
    context = my.createCanvasContext('componentDimCanvas');
    this.create(this.props.src).then(() => {
      this._drawimage(context);
    });
  },
  didUpdate() {
    // console.log(preProps);
  },
  didUnmount() {},
  methods: {
    /**
     * 向左转
     * by ruhignieh 2020-05-06
     */
    turnLeft() {
      this._drawimage(context);
      this._tempdirection(0);
    },

    /**
     * 向右转
     * by ruhignieh 2020-05-06
     */
    turnRight() {
      this._drawimage(context);
      this._tempdirection(1);
    },
    /**
     * canvas开始触摸移动事件,记录x，y
     * return x,y
     * by ruhignieh 2020-05-06
     */
    onTouchStart(e) {
      if (timer) {
        clearInterval(timer);
      }
      movex = e.touches[0].x;
      movey = e.touches[0].y;
      return { x: movex, y: movey };
    },
    onTouchEnd() {
      // console.log('onTouchEnd:', e);
    },

    /**
     * canvas触摸移动事件
     * 进行移动距离移动时间判断筛选并更新时间戳
     * by ruhignieh 2020-05-06
     */
    onTouchMove(e) {
      if (errNum) {
        return this._showError();
      }
      if (e.timeStamp - timeStamp6ab > this.props.moveFre) {
        if (scale == 1) {
          if (e.touches[0].x - movex > 0) {
            this.turnRight();
          } else if (e.touches[0].x - movex < 0) {
            this.turnLeft();
          }
        } else {
          context.scale(2, 2);
        }
      }
      timeStamp6ab = e.timeStamp;
    },

    /**
     * 计算canvas尺寸
     * by ruhignieh 2020-05-06
     */
    getstagesize() {
      let width = this.props.width,
        height = this.props.height;
      let canvasWidth = this.data.canvasWidth,
        canvasHeight = this.data.canvasHeight;
      let size = getcanvassize(
        width,
        height,
        systemInfo.windowWidth,
        systemInfo.windowHeight,
        this.data.picinfo.width,
        this.data.picinfo.height,
        canvasWidth,
        canvasHeight
      );
      this.setData({
        canvasWidth: size.canvasWidth,
        canvasHeight: size.canvasHeight,
        xHeight: size.height,
        xWidth: size.width
      });
      return size;
    },

    /**
     * 创建环视舞台
     * by ruhignieh 2020-05-06
     */
    create(picsrcs) {
      return this._cacheImage(picsrcs)
        .then(() => {
          my.showLoading({ title: '处理中' });
          stagesizetmp = this.getstagesize();
          my.hideLoading();
        })
        .catch((err) => {
          errNum = 401;
          errMsg = '图片序列获取失败';
          this._showError();
          return err;
        });
    },

    /**
     * 更新canvas
     * c为canvas实例化对象，即上面的context
     * by ruhignieh 2020-05-06
     */
    _drawimage(c) {
      if (
        (systemInfo.windowWidth -
          (stagesizetmp.canvasHeight * this.data.picinfo.width) /
            this.data.picinfo.height) /
          2 >
          0 &&
        this.props.width == 'auto'
      ) {
        stagesizetmpn =
          (systemInfo.windowWidth -
            (stagesizetmp.canvasHeight * this.data.picinfo.width) /
              this.data.picinfo.height) /
          2;
      }
      c.drawImage(
        this.data.picsrcs[this.data.itmp - 1].info.path,
        stagesizetmpn,
        0,
        parseFloat(this.data.canvasWidth),
        parseFloat(this.data.canvasHeight)
      );
      c.draw();
    },

    /**
     * 显示哪一张
     * d为向左还是向右
     * by ruhignieh 2020-05-06
     */
    _tempdirection(d) {
      let picLength = this.data.picsrcs.length;
      let view = this.data.view;
      let itmp = 1;

      if (this.data.itmp < picLength && this.data.itmp > 1) {
        if (d == 1) {
          itmp = this.data.itmp + 1;
        } else {
          itmp = this.data.itmp - 1;
        }
      } else if (this.data.itmp == 1) {
        if (d == 1) {
          itmp = this.data.itmp + 1;
        } else {
          if (view == 360) {
            itmp = picLength;
          } else {
            itmp = 1;
          }
        }
      } else if (this.data.itmp == picLength) {
        if (d == 1) {
          if (view == 360) {
            itmp = 1;
          } else {
            itmp = this.data.itmp;
          }
        } else {
          itmp = this.data.itmp - 1;
        }
      } else {
        itmp = 1;
      }
      this.setData({
        itmp: itmp
      });
      return itmp;
    },

    /**
     * 缓存照片并获取照片尺寸信息
     * by ruhignieh 2020-05-06
     */
    _cacheImage(src) {
      my.showLoading({ title: '载入中' });
      // let [profun, funtmp] = [[]];
      if (src[0]) {
        let promiseFuncArr = [];
        src.forEach((imageurl, index) => {
          if (imageurl.includes('resource')) {
            // funtmp = getImageInfo(imageurl);
          } else {
            let promiseTem = function () {
              return downloadFile(imageurl).then((imagetmpsrc) => {
                return {
                  index,
                  url: imageurl,
                  info: getImageInfo(imagetmpsrc)
                };
              });
            };
            promiseFuncArr.push(promiseTem);
          }
        });
        return new Promise((resolve) => {
          sequenceTasks(promiseFuncArr).then((imagetmpInfo) => {
            const getInfos = imagetmpInfo.map((item) => item.info);
            const promiseAll = Promise.all(getInfos)
              .then((val) => {
                my.hideLoading();
                const imageInfo = val.map((item, index) => {
                  return {
                    index,
                    url: imagetmpInfo[index].url,
                    info: val[index]
                  };
                });
                this.setData({
                  picinfo: val[0],
                  picsrcs: imageInfo
                });
                errNum = 0;
                return imageInfo;
              })
              .catch((err) => {
                errNum = 401;
                errMsg = '获取资源失败';
                my.hideLoading();
                this.setData({
                  xHeight: '300rpx'
                });
                this._showError();
                Promise.reject(err);
              });
            resolve(promiseAll);
          });
        });
      } else {
        return new Promise((resolve, reject) => {
          errNum = 401;
          errMsg = '获取资源失败';
          my.hideLoading();
          this.setData({
            picinfo: { path: '', width: 300, height: 360 },
            picsrcs: [{ index: 0, url: '', info: { path: '', width: 300, height: 360 } }],
            xHeight: '300rpx'
          });
          this._showError();
          reject(errMsg);
        });
      }
    },

    /**
     * 验证数据
     * by ruhignieh 2020-05-06
     */
    _verify(newVal) {
      if (typeof newVal == 'object') {
        if (!newVal) {
          errNum = 401;
          errMsg = '找不到图';
          this._showError();
        } else {
          errNum = 0;
          errMsg = '';
        }
      } else {
        errNum = 404;
        errMsg = '你的地址类型有点问题喔';
        this._showError();
      }
      return errNum;
    },

    /**
     * 显示错误
     * by ruhignieh 2020-05-06
     */
    _showError() {
      context.fillStyle = 'Salmon';
      context.setFontSize(16);
      context.setTextAlign('left');
      context.fillText(errNum + ':' + errMsg, 80, 50);
      context.draw();
      throw new Error(errNum + ':' + errMsg);
    }
  }
});
