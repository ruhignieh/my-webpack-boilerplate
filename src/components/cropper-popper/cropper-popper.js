/*
 * @Descripttion:
 * @file:
 * @module:
 * @version: 1.0.0
 * @Author: Ruhig Nieh
 * @Date: 2020-07-13 10:53:40
 * @LastEditors: Ruhig Nieh
 * @LastEditTime: 2020-07-13 10:54:31
 */

Component({
  mixins: [],
  data: {
    cropperSize: {},
    cancelBtn: {
      text: "取消",
    },
    confirmBtn: {
      text: "应用",
    },
  },
  props: {
    show: {
      type: Boolean,
      value: false,
    },
    image: {
      type: String,
      value: "",
    },
    cropperRadio: String,
    onClose: () => {},
    onCancel: () => {},
    onConfirm: () => {},
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    _onClose() {
      this.setData({
        show: false,
      });
    },
    handleComplete(data) {
      this.setData({
        cropperSize: data,
      });
    },
    onClose() {
      this.props.onClose();
    },
    onCancel() {
      this.props.onCancel();
    },
    onConfirm() {
      const { cropperSize } = this.data;
      const getScale = 1 - cropperSize.left - cropperSize.right;
      const pixel = cropperSize.width * getScale;
      // eslint-disable-next-line no-magic-numbers
      if (pixel < 96) {
        my.showToast({
          type: "exception",
          duration: 2000,
          content: "裁剪框尺寸可能导致不清晰。",
        });
      }
      this.props.onConfirm(cropperSize);
    },
  },
});
