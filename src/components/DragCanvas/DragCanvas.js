/* eslint-disable no-magic-numbers */
import dragGraph from './dragGraph';
let isMove = false; // 标识触摸后是否有移动，用来判断是否需要增加操作历史

Component({
    mixins: [],
    data: {
        bgColor: '',
        bgSourceId: '',
        bgImage: '',
        history: [] // 历史记录
    },
    props: {
        graph: {},
        bgColor: '',
        bgImage: '',
        bgSourceId: '',
        width: 750,
        height: 750,
        enableUndo: false
    },
    didMount() {
        const sysInfo = my.getSystemInfoSync();
        const screenWidth = sysInfo.screenWidth;
        this.factor = screenWidth / 750;

        if (typeof this.drawArr === 'undefined') {
            this.drawArr = [];
        }
        this.ctx = my.createCanvasContext('componentDragCanvas');
        // this.draw();
        this.onGraphChange(this.props.graph);
    },
    didUpdate(preProps) {
        console.log('didUpdate:', preProps);
    },
    didUnmount() {},
    methods: {
        toPx(rpx) {
            return rpx * this.factor;
        },
        initBg() {
            // this.data.bgColor = '';
            // this.data.bgSourceId = '';
            // this.data.bgImage = '';
            this.setData({
                bgColor: '',
                bgSourceId: '',
                bgImage: ''
            });
        },
        initHistory() {
            this.setData({
                history: []
            });
            // this.data.history = [];
        },
        recordHistory() {
            if (!this.data.enableUndo) {
                return;
            }
            this.exportJson()
                .then(imgArr => {
                    const { history } = this.data;
                    this.setData({
                        history: history.push(JSON.stringify(imgArr))
                    });
                    // this.data.history.push(JSON.stringify(imgArr));
                })
                .catch(e => {
                    console.error(e);
                });
        },
        undo() {
            const { history } = this.data;
            if (!this.data.enableUndo) {
                console.log('后退功能未启用，请设置enableUndo={{true}}');
                return;
            }
            if (this.data.history.length > 1) {
                // this.data.history.pop();
                // let newConfigObj = this.data.history[this.data.history.length - 1];
                this.setData({
                    history: history.pop()
                });
                const newConfigObj = history[history.length - 1];
                this.initByArr(JSON.parse(newConfigObj));
            } else {
                console.log('已是第一步，不能回退');
            }
        },
        onGraphChange(n) {
            console.log('onGraphChange');
            if (JSON.stringify(n) === '{}') { return; }
            this.drawArr.push(
                // eslint-disable-next-line new-cap
                new dragGraph(
                    Object.assign(
                        {
                            x: 30,
                            y: 30
                        },
                        n
                    ),
                    this.ctx,
                    this.factor
                )
            );
            this.draw();
            // 参数有变化时记录历史
            this.recordHistory();
        },
        initByArr(newArr) {
            this.drawArr = []; // 重置绘画元素
            this.initBg(); // 重置绘画背景
            // 循环插入 drawArr
            newArr.forEach((item, index) => {
                switch (item.type) {
                    case 'bgColor':
                        // this.data.bgImage = '';
                        // this.data.bgSourceId = '';
                        // this.data.bgColor = item.color;
                        this.setData({
                            bgImage: '',
                            bgSourceId: '',
                            bgColor: item.color
                        });
                        break;
                    case 'bgImage':
                        this.setData({
                            bgColor: '',
                            bgImage: item.url
                        });
                        // this.data.bgColor = '';
                        // this.data.bgImage = item.url;
                        if (item.sourceId) {
                            this.setData({
                                bgSourceId: item.sourceId
                            });
                            // this.data.bgSourceId = item.sourceId;
                        }
                        break;
                    case 'image':
                    case 'text':
                        if (index === newArr.length - 1) {
                            item.selected = true;
                        } else {
                            item.selected = false;
                        }
                        // eslint-disable-next-line new-cap
                        this.drawArr.push(new dragGraph(item, this.ctx, this.factor));
                        break;
                }
            });
            this.draw();
        },
        draw() {
            if (this.data.bgImage !== '') {
                this.ctx.drawImage(
                    this.data.bgImage,
                    0,
                    0,
                    this.toPx(this.props.width),
                    this.toPx(this.props.height)
                );
            }
            if (this.data.bgColor !== '') {
                this.ctx.save();
                this.ctx.setFillStyle(this.data.bgColor);
                this.ctx.fillRect(
                    0,
                    0,
                    this.toPx(this.props.width),
                    this.toPx(this.props.height)
                );
                this.ctx.restore();
            }
            this.drawArr.forEach(item => {
                item.paint();
            });
            return new Promise(resolve => {
                this.ctx.draw(false, () => {
                    resolve();
                });
            });
        },
        onTouchStart(e) {
            isMove = false; // 重置移动标识
            const { x, y } = e.touches[0];
            this.tempGraphArr = [];
            let lastDelIndex = null; // 记录最后一个需要删除的索引
            this.drawArr
        && this.drawArr.forEach((item, index) => {
            const action = item.isInGraph(x, y);
            if (action) {
                item.action = action;
                this.tempGraphArr.push(item);
                // 保存点击时的坐标
                this.currentTouch = { x, y };
                if (action === 'del') {
                    lastDelIndex = index; // 标记需要删除的元素
                }
            } else {
                item.action = false;
                item.selected = false;
            }
        });
            // 保存点击时元素的信息
            if (this.tempGraphArr.length > 0) {
                for (let i = 0; i < this.tempGraphArr.length; i++) {
                    const lastIndex = this.tempGraphArr.length - 1;
                    // 对最后一个元素做操作
                    if (i === lastIndex) {
                        // 未选中的元素，不执行删除和缩放操作
                        if (lastDelIndex !== null && this.tempGraphArr[i].selected) {
                            if (this.drawArr[lastDelIndex].action === 'del') {
                                this.drawArr.splice(lastDelIndex, 1);
                                this.ctx.clearRect(
                                    0,
                                    0,
                                    this.toPx(this.data.width),
                                    this.toPx(this.data.height)
                                );
                            }
                        } else {
                            this.tempGraphArr[lastIndex].selected = true;
                            this.currentGraph = Object.assign({}, this.tempGraphArr[lastIndex]);
                        }
                    } else {
                        // 不是最后一个元素，不需要选中，也不记录状态
                        this.tempGraphArr[i].action = false;
                        this.tempGraphArr[i].selected = false;
                    }
                }
            }
            this.draw();
        },
        onTouchMove(e) {
            const { x, y } = e.touches[0];
            if (this.tempGraphArr && this.tempGraphArr.length > 0) {
                isMove = true; // 有选中元素，并且有移动时，设置移动标识
                const currentGraph = this.tempGraphArr[this.tempGraphArr.length - 1];
                if (currentGraph.action === 'move') {
                    currentGraph.centerX = this.currentGraph.centerX + (x - this.currentTouch.x);
                    currentGraph.centerY = this.currentGraph.centerY + (y - this.currentTouch.y);
                    // 使用中心点坐标计算位移，不使用 x,y 坐标，因为会受旋转影响。
                    if (currentGraph.type !== 'text') {
                        currentGraph.x = currentGraph.centerX - this.currentGraph.w / 2;
                        currentGraph.y = currentGraph.centerY - this.currentGraph.h / 2;
                    }
                } else if (currentGraph.action === 'transform') {
                    currentGraph.transform(
                        this.currentTouch.x,
                        this.currentTouch.y,
                        x,
                        y,
                        this.currentGraph
                    );
                }
                // 更新4个坐标点（相对于画布的坐标系）
                currentGraph._rotateSquare();

                this.draw();
            }
        },
        onTouchEnd() {
            this.tempGraphArr = [];
            if (isMove) {
                isMove = false; // 重置移动标识
                // 用户操作结束时记录历史
                this.recordHistory();
            }
        },
        export() {
            return new Promise((resolve, reject) => {
                this.drawArr = this.drawArr.map(item => {
                    item.selected = false;
                    return item;
                });
                this.draw().then(() => {
                    this.ctx.toTempFilePath({
                        success(res) {
                            console.log(res);
                            resolve(res.tempFilePath);
                        },
                        fail(e) {
                            console.log(e);
                            reject(e);
                        }
                    });
                });
            });
        },
        exportJson() {
            return new Promise(resolve => {
                const exportArr = this.drawArr.map(item => {
                    item.selected = false;
                    switch (item.type) {
                        case 'image':
                            return {
                                type: 'image',
                                url: item.fileUrl,
                                y: item.y,
                                x: item.x,
                                w: item.w,
                                h: item.h,
                                rotate: item.rotate,
                                sourceId: item.sourceId
                            };
                            // break;
                        case 'text':
                            return {
                                type: 'text',
                                text: item.text,
                                color: item.color,
                                fontSize: item.fontSize,
                                y: item.y,
                                x: item.x,
                                w: item.w,
                                h: item.h,
                                rotate: item.rotate
                            };
            // break;
                    }
                });
                if (this.data.bgImage) {
                    // eslint-disable-next-line camelcase
                    const tmp_img_config = {
                        type: 'bgImage',
                        url: this.data.bgImage
                    };
                    if (this.data.bgSourceId) {
                        // eslint-disable-next-line camelcase
                        tmp_img_config['sourceId'] = this.data.bgSourceId;
                    }
                    exportArr.unshift(tmp_img_config);
                } else if (this.data.bgColor) {
                    exportArr.unshift({
                        type: 'bgColor',
                        color: this.data.bgColor
                    });
                }

                resolve(exportArr);
            });
        },
        changColor(color) {
            const selected = this.drawArr.filter(item => item.selected);
            if (selected.length > 0) {
                selected[0].color = color;
            }
            this.draw();
            // 改变文字颜色时记录历史
            this.recordHistory();
        },
        changeBgColor(color) {
            this.setData({
                bgImage: '',
                bgColor: color
            });
            // this.data.bgImage = '';
            // this.data.bgColor = color;
            this.draw();
            // 改变背景颜色时记录历史
            this.recordHistory();
        },
        changeBgImage(newBgImg) {
            // this.data.bgColor = '';
            this.setData({
                bgColor: ''
            });
            if (typeof newBgImg === 'string') {
                this.setData({
                    bgSourceId: '',
                    bgImage: newBgImg
                });
                // this.data.bgSourceId = '';
                // this.data.bgImage = newBgImg;
            } else {
                this.setData({
                    bgSourceId: newBgImg.sourceId,
                    bgImage: newBgImg.url
                });
                // this.data.bgSourceId = newBgImg.sourceId;
                // this.data.bgImage = newBgImg.url;
            }
            this.draw();
            // 改变背景图片时记录历史
            this.recordHistory();
        },
        clearCanvas() {
            this.ctx.clearRect(0, 0, this.toPx(this.data.width), this.toPx(this.data.height));
            this.ctx.draw();
            this.drawArr = [];
            this.initBg(); // 重置绘画背景
            this.initHistory(); // 清空历史记录
        }
    }
});
