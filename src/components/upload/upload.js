const { cloud } = getApp();

Component({
  mixins: [],
  data: {
    showUpload: false,
    // activeImageId: null,
    titleOpen: "请上传你和TA的照片",
    title: "请点击勾选照片，再按下一步",
    tips: "注：一次仅支持上传一张照片，共支持上传5张照片",
    iconTitle: "继续上传",
    addNewTitle: "点击长传图片",
    imageList: [],
  },
  props: {
    show: false,
    styles: {},
    activeImageId: null,
    onClickUpload: () => {},
    onSelectedImage: () => {},
    onClose: () => {},
  },
  didMount() {},
  didUpdate() {
    if (!this.props.activeImageId) {
      this.clear();
    }
  },
  didUnmount() {},
  methods: {
    closed() {
      this.props.onClose();
    },
    clear() {
      this.setData({
        activeImageId: null,
      });
    },
    del(e) {
      const {
        dataset: { item = "" },
      } = e.target;
      let { activeImageId } = this.data;
      const { imageList } = this.data;
      const findIndex = imageList.findIndex((image) => image.id === item.id);
      const getRemovedItem = imageList.splice(findIndex, 1);
      if (getRemovedItem[0].id === activeImageId) {
        activeImageId = null;
        this.props.onSelectedImage();
      }
      this.setData({
        imageList,
        activeImageId,
      });
    },
    onClickImage(e) {
      const val = e.target.dataset.value;
      this.setData({
        activeImageId: val.id,
      });
      this.props.onSelectedImage(val);
    },
    onUpload() {
      my.chooseImage({
        count: 1,
        isClipped: false,
        success: (res) => {
          const { imageList } = this.data;
          const id = Math.random();
          imageList.push({
            id,
            src: "",
            origin: res.apFilePaths[0],
          });
          this.setData({ imageList });
          this.uploadCloud(res.apFilePaths[0], id);
        },
      });
    },
    uploadCloud(url, index) {
      cloud.file.uploadFile({
        filePath: url,
        fileType: "image",
        fileName: "/user/" + new Date().getTime() + ".png",
        success: (e) => {
          try {
            my.tb.imgRisk({
              data: {
                cloudFileId: e.fileId,
              },
              success: (res) => {
                console.log(res);
                if (res.data.result.checkPoints[0].suggestion === "block") {
                  this.getImage(false);
                } else {
                  this.getImage(true, index, e.url);
                }
              },
              fail: () => {
                this.getImage(true, index, e.url);
              },
            });
          } catch (err) {
            this.getImage(true, index, e.url);
            return;
          }
          // this.getImage(true, index, e.url);
        },
        fail: () => {
          my.showToast({
            type: "fail",
            duration: 1000,
            content: "上传失败，请重试！",
          });
          // my.alert({
          //   title: "fail",
          //   content: JSON.stringify(e)
          // });
          this.getImage(false);
        },
      });
    },
    async getImage(status, index, uri) {
      const { imageList } = this.data;
      const findIndex = imageList.findIndex((image) => image.id === index);
      if (!status) {
        imageList.splice(findIndex, 1);
        this.setData({
          imageList,
        });
        return;
      }
      const { request } = getApp();
      const params = {
        kind: "getImage",
        data: { uri },
      };
      const data = await request.fetch(params);
      // my.alert({
      //   title: "fail ",
      //   content: JSON.stringify(data)
      // });
      if (data.success) {
        const itemSrc = `imageList[${findIndex}].src`;
        this.setData({
          [itemSrc]: data.data,
        });
        return;
      }
      imageList.splice(findIndex, 1);
      this.setData({
        imageList,
      });
    },
  },
});
