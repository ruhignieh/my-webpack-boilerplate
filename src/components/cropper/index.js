/* eslint-disable no-magic-numbers */
// import { throttle } from "/utils/utils";
// import './cropper.less';
// import x from './assets/left.png';
// console.log(x)

// eslint-disable-next-line new-cap
Component({
  mixins: [],
  data: {
    // cutSizeRatio: 9.8 / 6.8,
    hideLoading: false,
    cropperWidth: 0,
    cropperHeight: 0,
    imgViewHeight: 0,
    imageNotChoosed: false,
    imageUrl: '',
    imgWidth: 0,
    imgHeight: 0,
    imgTop: 0,
    imgLeft: 0,
    imgFromTop: 0,
    // 裁剪框 宽高
    cutW: 0,
    cutH: 0,
    cutL: 0,
    cutT: 0,
  },
  props: {
    cutSizeRatio: 9.8 / 6.8,
    defaultSize: {
      width: 345,
      height: 230,
    },
    image: '',
    cutRadio: '',
    onComplete: () => {},
  },
  didMount() {
    this.mapActionScales = this.actionScales();
    this.device = my.getSystemInfoSync();
    this.deviceRatio = this.device.windowWidth / 414;
    this.setData({
      cropperWidth: 345 * this.deviceRatio,
      cropperHeight: 230 * this.deviceRatio,
    });
    // eslint-disable-next-line no-use-before-define
    loadImgOnImage(this).then(() => {
      this.openCroper();
      const query = my.createSelectorQuery();
      query.select('.component-moet-cropper').boundingClientRect();
      query.exec((res) => {
        const left = (res[0].width - this.data.imgWidth) / 2;
        this.setData(
          {
            hideLoading: true,
            imgFromTop: res[0].top,
            imgLeft: left,
            cutL: left,
            imgFromLeft: res[0].left,
            imgFromRight: res[0].right,
            maxDragX: Math.floor(res[0].right - left) - 2,
            minDragX: Math.floor(res[0].left + left) - 2,
            maxDragY: Math.floor(res[0].top + this.data.imgHeight) - 2,
            minDragY: Math.floor(res[0].top) - 2,
          },
          () => {
            this.competeCrop(this.data);
          }
        );
      });
    });
  },
  didUnmount() {},
  methods: {
    openCroper() {
      const minCutL = Math.max(0, this.data.imgLeft);
      const minCutT = Math.max(0, this.data.imgTop);
      const { cutSizeRatio } = this.props;
      if (this.imageRatio > this.frameRatio) {
        this.setData({
          cutH: this.initScaleHeight - 2,
          cutW: this.initScaleHeight * cutSizeRatio - 2,
        });
      } else {
        let h;
        let w;
        if (this.initScaleWidth / cutSizeRatio > this.initScaleHeight) {
          h = this.initScaleHeight - 2;
          w = h * cutSizeRatio - 2;
        } else {
          h = this.initScaleWidth / cutSizeRatio - 2;
          w = this.initScaleWidth - 2;
        }
        this.setData({
          cutH: h,
          cutW: w,
        });
      }
      this.setData({
        cutL: minCutL,
        cutT: minCutT,
      });
    },
    actionScales() {
      const { cutSizeRatio } = this.props;
      const leftTop = ({ dragMoveX, dragLengthX, dragMoveY, dragLengthY }) => {
        if (
          dragLengthX + this.initDragCutW >= 0 &&
          dragLengthY + this.initDragCutH >= 0
        ) {
          if (this.imageRatio > this.frameRatio) {
            this.setData(
              {
                cutT: dragMoveY - this.data.imgFromTop,
                cutL: dragMoveX - this.data.imgFromLeft,
                cutW: (-dragLengthY + this.initDragCutH) * cutSizeRatio - 2,
                cutH: -dragLengthY + this.initDragCutH - 2,
              },
              () => {
                this.competeCrop(this.data);
              }
            );
          } else {
            if ((-dragLengthX + this.initDragCutW) / cutSizeRatio - 2 < 0) {
              return;
            }
            if (-dragLengthX + this.initDragCutW - 2 < 0) {
              return;
            }
            if (
              dragMoveX -
                this.data.imgLeft -
                this.data.imgFromLeft +
                (-dragLengthX + this.initDragCutW - 2) >
              this.data.imgWidth - 2
            ) {
              return;
            }
            if (
              dragMoveY -
                this.data.imgFromTop +
                (-dragLengthX + this.initDragCutW) / cutSizeRatio -
                2 >
              this.data.imgHeight
            ) {
              return;
            }
            this.setData(
              {
                cutT: dragMoveY - this.data.imgFromTop,
                cutL: dragMoveX - this.data.imgFromLeft,
                cutW: -dragLengthX + this.initDragCutW - 2,
                cutH: (-dragLengthX + this.initDragCutW) / cutSizeRatio - 2,
              },
              () => {
                this.competeCrop(this.data);
              }
            );
          }
        } else {
          return;
        }
      };
      const bottomLeft = ({ dragMoveX, dragLengthX, dragLengthY }) => {
        if (
          dragLengthX + this.initDragCutW >= 0 &&
          dragLengthY + this.initDragCutH >= 0
        ) {
          if (this.imageRatio > this.frameRatio) {
            this.setData(
              {
                cutL: dragMoveX - this.data.imgFromLeft,
                cutW: (dragLengthY + this.initDragCutH) * cutSizeRatio - 2,
                cutH: dragLengthY + this.initDragCutH - 2,
              },
              () => {
                this.competeCrop(this.data);
              }
            );
          } else {
            if ((-dragLengthX + this.initDragCutW) / cutSizeRatio - 2 < 0) {
              return;
            }
            if (-dragLengthX + this.initDragCutW - 2 < 0) {
              return;
            }
            if (
              dragMoveX -
                this.data.imgLeft -
                this.data.imgFromLeft +
                (-dragLengthX + this.initDragCutW - 2) >
              this.data.imgWidth - 2
            ) {
              return;
            }
            this.setData(
              {
                cutL: dragMoveX - this.data.imgFromLeft,
                cutW: -dragLengthX + this.initDragCutW - 2,
                cutH: (-dragLengthX + this.initDragCutW) / cutSizeRatio - 2,
              },
              () => {
                this.competeCrop(this.data);
              }
            );
          }
        } else {
          return;
        }
      };
      const topRight = ({ dragMoveY, dragLengthX, dragLengthY, dragMoveX }) => {
        if (
          dragLengthX + this.initDragCutW >= 0 &&
          dragLengthY + this.initDragCutH >= 0
        ) {
          if (this.imageRatio > this.frameRatio) {
            // dragLengthY为负值的时候则为增大
            this.setData(
              {
                cutT: dragMoveY - this.data.imgFromTop,
                cutW: (-dragLengthY + this.initDragCutH) * cutSizeRatio - 2,
                cutH: -dragLengthY + this.initDragCutH - 2,
              },
              () => {
                this.competeCrop(this.data);
              }
            );
          } else {
            if (
              dragMoveX - this.data.imgLeft - this.data.imgFromLeft >
              this.data.imgWidth - 2
            ) {
              return;
            }
            if (
              dragMoveY -
                this.data.imgFromTop +
                (dragLengthX + this.initDragCutW) / cutSizeRatio -
                2 >
              this.data.imgHeight
            ) {
              return;
            }
            this.setData(
              {
                cutT: dragMoveY - this.data.imgFromTop,
                cutW: dragLengthX + this.initDragCutW - 2,
                cutH: (dragLengthX + this.initDragCutW) / cutSizeRatio - 2,
              },
              () => {
                this.competeCrop(this.data);
              }
            );
          }
        } else {
          return;
        }
      };
      const rightBottom = ({ dragLengthX, dragLengthY, dragMoveX }) => {
        if (
          dragLengthX + this.initDragCutW >= 0 &&
          dragLengthY + this.initDragCutH >= 0
        ) {
          if (this.imageRatio > this.frameRatio) {
            this.setData(
              {
                cutW: (dragLengthY + this.initDragCutH) * cutSizeRatio - 2,
                cutH: dragLengthY + this.initDragCutH - 2,
              },
              () => {
                this.competeCrop(this.data);
              }
            );
          } else {
            if (
              dragMoveX - this.data.imgLeft - this.data.imgFromLeft >
              this.data.imgWidth - 2
            ) {
              return;
            }
            this.setData(
              {
                cutW: dragLengthX + this.initDragCutW - 2,
                cutH: (dragLengthX + this.initDragCutW) / cutSizeRatio - 2,
              },
              () => {
                this.competeCrop(this.data);
              }
            );
          }
        } else {
          return;
        }
      };
      return new Map([
        ['leftTop', leftTop],
        ['bottomLeft', bottomLeft],
        ['topRight', topRight],
        ['rightBottom', rightBottom],
      ]);
    },
    croperStart(e) {
      this.croperX = e.touches[0].clientX;
      this.croperY = e.touches[0].clientY;
    },
    croperMove(e) {
      const dragLengthX = e.touches[0].clientX - this.croperX;
      const dragLengthY = e.touches[0].clientY - this.croperY;
      const minCutL = Math.max(0, this.data.imgLeft);
      const minCutT = Math.max(0, this.data.imgTop);
      const maxCutL = Math.min(
        750 * this.deviceRatio - this.data.cutW,
        this.data.imgLeft + this.data.imgWidth - this.data.cutW - 2
      );
      const maxCutT = Math.min(
        this.imgViewHeight - this.data.cutH - this.data.imgTop - 2,
        this.data.imgFromTop +
          this.data.imgTop +
          this.data.imgHeight -
          this.data.cutH
      );
      let newCutL = this.data.cutL + dragLengthX;
      let newCutT = this.data.cutT + dragLengthY;
      if (newCutL < minCutL) {
        newCutL = minCutL;
      }
      if (newCutL > maxCutL) {
        newCutL = maxCutL;
      }
      if (newCutT < minCutT) {
        newCutT = minCutT;
      }
      if (newCutT > maxCutT) {
        newCutT = maxCutT;
      }
      this.setData(
        {
          cutL: newCutL,
          cutT: newCutT,
        },
        () => this.competeCrop(this.data)
      );
      this.croperX = e.touches[0].clientX;
      this.croperY = e.touches[0].clientY;
    },
    dragPointStart(e) {
      this.dragStartX = e.touches[0].clientX;
      this.dragStartY = e.touches[0].clientY;
      this.initDragCutW = this.data.cutW;
      this.initDragCutH = this.data.cutH;
      const dragType = e.target.dataset.drag;
      this.currentAction = this.mapActionScales.get(dragType);
    },
    dragPointMove(e) {
      const { maxDragX, minDragX, maxDragY, minDragY } = this.data;
      if (e.touches[0].clientY > maxDragY || e.touches[0].clientY < minDragY) {
        return;
      }
      if (e.touches[0].clientx > maxDragX || e.touches[0].clientX < minDragX) {
        return;
      }
      let dragMoveX = Math.min(e.touches[0].clientX, maxDragX);
      dragMoveX = Math.max(dragMoveX, minDragX);
      dragMoveX = Math.floor(dragMoveX);
      let dragMoveY = Math.min(e.touches[0].clientY, maxDragY);
      dragMoveY = Math.max(dragMoveY, minDragY);
      dragMoveY = Math.floor(dragMoveY);
      let dragLengthX = dragMoveX - this.dragStartX;
      dragLengthX = Math.floor(dragLengthX);
      let dragLengthY = dragMoveY - this.dragStartY;
      dragLengthY = Math.floor(dragLengthY);
      this.currentAction({ dragMoveX, dragMoveY, dragLengthX, dragLengthY });
    },
    competeCrop(data) {
      const getSize = {
        left: (data.cutL - data.imgLeft) / data.imgWidth,
        top: data.cutT / data.imgHeight,
        right:
          (data.imgWidth - (data.cutL - data.imgLeft + data.cutW)) /
          data.imgWidth,
        bottom: (data.imgHeight - (data.cutT + data.cutH)) / data.imgHeight,
        width: data.imgWidth,
        height: data.imgHeight,
      };
      getSize.left = Math.max(0, getSize.left);
      getSize.left = Math.min(1, getSize.left);
      getSize.top = Math.max(0, getSize.top);
      getSize.top = Math.min(1, getSize.top);
      getSize.right = Math.max(0, getSize.right);
      getSize.right = Math.min(1, getSize.right);
      getSize.bottom = Math.max(0, getSize.bottom);
      getSize.bottom = Math.min(1, getSize.bottom);
      this.props.onComplete(getSize);
    },
  },
});

function loadImgOnImage(self) {
  return new Promise((resolve, reject) => {
    my.getImageInfo({
      src: self.props.image,
      success: (res) => {
        self.oldScale = 1;
        self.imageRatio = res.width / res.height; // 图片宽高比
        self.frameRatio =
          self.props.defaultSize.width / self.props.defaultSize.height;
        if (self.imageRatio > self.frameRatio) {
          self.scaleWidth = 345 * self.deviceRatio;
          self.scaleHeight = Math.min(
            self.scaleWidth / self.imageRatio,
            230 * self.deviceRatio
          );
          self.imgViewHeight = self.scaleHeight;
        } else {
          self.scaleHeight = 230 * self.deviceRatio;
          self.scaleWidth = Math.min(
            self.scaleHeight * self.imageRatio,
            345 * self.deviceRatio
          );
          self.imgViewHeight = self.scaleHeight;
        }
        self.initScaleWidth = self.scaleWidth;
        self.initScaleHeight = self.scaleHeight;
        self.startX = 0;
        self.startY = 0;
        self.setData({
          imgWidth: self.scaleWidth,
          imgHeight: self.scaleHeight,
          imgTop: self.startY,
          imgLeft: self.startX,
          imgViewHeight: self.imgViewHeight,
        });
        my.hideLoading();
        resolve(res);
      },
      fail: (e) => {
        reject(e);
      },
    });
  });
}
