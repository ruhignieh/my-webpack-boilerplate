const DELETE_ICON = '/components/DragCanvas/icon/close.png'; // 删除按钮
const DRAG_ICON = '/components/DragCanvas/icon/scale.png'; // 缩放按钮
const STROKE_COLOR = 'red';
const ROTATE_ENABLED = true;

const DEBUG_MODE = false; // 打开调试后会渲染操作区域边框（无背景时有效

export default class {
  constructor(
    {
      x = 30,
      y = 30,
      w,
      h,
      type,
      text,
      fontSize = 20,
      color = 'red',
      url = null,
      rotate = 0,
      sourceId = null,
      selected = true
    },
    canvas,
    factor
  ) {
    if (type === 'text') {
      canvas.setFontSize(fontSize);
      const textWidth = canvas.measureText(text).width;
      const textHeight = fontSize + 10;
      this.centerX = x + textWidth / 2;
      this.centerY = y + textHeight / 2;
      this.w = textWidth;
      this.h = textHeight;
    } else {
      this.centerX = x + w / 2;
      this.centerY = y + h / 2;
      this.w = w;
      this.h = h;
    }
    this.x = x;
    this.y = y;
    // 4个顶点坐标
    this.square = [
      [this.x, this.y],
      [this.x + this.w, this.y],
      [this.x + this.w, this.y + this.h],
      [this.x, this.y + this.h]
    ];

    this.fileUrl = url;
    this.text = text;
    this.fontSize = fontSize;
    this.color = color;
    this.ctx = canvas;
    this.rotate = rotate;
    this.type = type;
    this.selected = selected;
    this.factor = factor;
    this.sourceId = sourceId;
    this.MIN_WIDTH = 20;
    this.MIN_FONTSIZE = 10;
  }

  /**
   * 绘制元素
   */
  paint() {
    this.ctx.save();
    // 由于measureText获取文字宽度依赖于样式，所以如果是文字元素需要先设置样式
    let textWidth = 0;
    let textHeight = 0;
    if (this.type === 'text') {
      this.ctx.setFontSize(this.fontSize);
      this.ctx.setTextBaseline('middle');
      this.ctx.setTextAlign('center');
      this.ctx.setFillStyle(this.color);
      textWidth = this.ctx.measureText(this.text).width;
      textHeight = this.fontSize + 10;
      // 字体区域中心点不变，左上角位移
      this.x = this.centerX - textWidth / 2;
      this.y = this.centerY - textHeight / 2;
    }

    // 旋转元素
    this.ctx.translate(this.centerX, this.centerY);
    this.ctx.rotate((this.rotate * Math.PI) / 180);
    this.ctx.translate(-this.centerX, -this.centerY);
    // 渲染元素
    if (this.type === 'text') {
      this.ctx.fillText(this.text, this.centerX, this.centerY);
    } else if (this.type === 'image') {
      this.ctx.drawImage(this.fileUrl, this.x, this.y, this.w, this.h);
    }
    // 如果是选中状态，绘制选择虚线框，和缩放图标、删除图标
    if (this.selected) {
      this.ctx.setLineDash([2, 5]);
      this.ctx.setLineWidth(2);
      this.ctx.setStrokeStyle(STROKE_COLOR);
      this.ctx.lineDashOffset = 6;

      if (this.type === 'text') {
        this.ctx.strokeRect(this.x, this.y, textWidth, textHeight);
        this.ctx.drawImage(DELETE_ICON, this.x - 15, this.y - 15, 30, 30);
        this.ctx.drawImage(
          DRAG_ICON,
          this.x + textWidth - 15,
          this.y + textHeight - 15,
          30,
          30
        );
      } else {
        this.ctx.strokeRect(this.x, this.y, this.w, this.h);
        this.ctx.drawImage(DELETE_ICON, this.x - 15, this.y - 15, 30, 30);
        this.ctx.drawImage(DRAG_ICON, this.x + this.w - 15, this.y + this.h - 15, 30, 30);
      }
    }
    this.ctx.restore();
  }
  /**
   * 给矩形描边
   * @private
   */
  _drawBorder() {
    let p = this.square;
    let ctx = this.ctx;
    this.ctx.save();
    this.ctx.beginPath();
    ctx.setStrokeStyle('orange');
    this._draw_line(this.ctx, p[0], p[1]);
    this._draw_line(this.ctx, p[1], p[2]);
    this._draw_line(this.ctx, p[2], p[3]);
    this._draw_line(this.ctx, p[3], p[0]);
    ctx.restore();
  }
  /**
   * 画一条线
   * @param ctx
   * @param a
   * @param b
   * @private
   */
  _draw_line(ctx, a, b) {
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
  }
  /**
   * 判断点击的坐标落在哪个区域
   * @param {*} x 点击的坐标
   * @param {*} y 点击的坐标
   */
  isInGraph(x, y) {
    // 删除区域左上角的坐标和区域的高度宽度
    const delW = 30;
    const delH = 30;

    // 旋转后的删除区域坐标
    const transformedDelCenter = this._rotatePoint(
      this.x,
      this.y,
      this.centerX,
      this.centerY,
      this.rotate
    );
    const transformDelX = transformedDelCenter[0] - delW / 2;
    const transformDelY = transformedDelCenter[1] - delH / 2;

    // 变换区域左上角的坐标和区域的高度宽度
    const scaleW = 30;
    const scaleH = 30;
    const transformedScaleCenter = this._rotatePoint(
      this.x + this.w,
      this.y + this.h,
      this.centerX,
      this.centerY,
      this.rotate
    );

    // 旋转后的变换区域坐标
    const transformScaleX = transformedScaleCenter[0] - scaleW / 2;
    const transformScaleY = transformedScaleCenter[1] - scaleH / 2;

    // 调试使用，标识可操作区域
    if (DEBUG_MODE) {
      // 标识删除按钮区域
      this.ctx.setLineWidth(1);
      this.ctx.setStrokeStyle('red');
      this.ctx.strokeRect(transformDelX, transformDelY, delW, delH);
      // 标识旋转/缩放按钮区域
      this.ctx.setLineWidth(1);
      this.ctx.setStrokeStyle('black');
      this.ctx.strokeRect(transformScaleX, transformScaleY, scaleW, scaleH);
      // 标识移动区域
      this._drawBorder();
    }

    if (
      x - transformScaleX >= 0 &&
      y - transformScaleY >= 0 &&
      transformScaleX + scaleW - x >= 0 &&
      transformScaleY + scaleH - y >= 0
    ) {
      // 缩放区域
      return 'transform';
    } else if (
      x - transformDelX >= 0 &&
      y - transformDelY >= 0 &&
      transformDelX + delW - x >= 0 &&
      transformDelY + delH - y >= 0
    ) {
      // 删除区域
      return 'del';
    } else if (this.insidePolygon(this.square, [x, y])) {
      return 'move';
    }
    // 不在选择区域里面
    return false;
  }
  /**
   *  判断一个点是否在多边形内部
   *  @param points 多边形坐标集合
   *  @param testPoint 测试点坐标
   *  返回true为真，false为假
   *  */
  insidePolygon(points, testPoint) {
    let x = testPoint[0],
      y = testPoint[1];
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      let xi = points[i][0],
        yi = points[i][1];
      let xj = points[j][0],
        yj = points[j][1];

      let intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }
  /**
   * 计算旋转后矩形四个顶点的坐标（相对于画布）
   * @private
   */
  _rotateSquare() {
    this.square = [
      this._rotatePoint(this.x, this.y, this.centerX, this.centerY, this.rotate),
      this._rotatePoint(this.x + this.w, this.y, this.centerX, this.centerY, this.rotate),
      this._rotatePoint(
        this.x + this.w,
        this.y + this.h,
        this.centerX,
        this.centerY,
        this.rotate
      ),
      this._rotatePoint(this.x, this.y + this.h, this.centerX, this.centerY, this.rotate)
    ];
  }
  /**
   * 计算旋转后的新坐标（相对于画布）
   * @param x
   * @param y
   * @param centerX
   * @param centerY
   * @param degrees
   * @returns {*[]}
   * @private
   */
  _rotatePoint(x, y, centerX, centerY, degrees) {
    let newX =
      (x - centerX) * Math.cos((degrees * Math.PI) / 180) -
      (y - centerY) * Math.sin((degrees * Math.PI) / 180) +
      centerX;
    let newY =
      (x - centerX) * Math.sin((degrees * Math.PI) / 180) +
      (y - centerY) * Math.cos((degrees * Math.PI) / 180) +
      centerY;
    return [newX, newY];
  }
  /**
   *
   * @param {*} px 手指按下去的坐标
   * @param {*} py 手指按下去的坐标
   * @param {*} x 手指移动到的坐标
   * @param {*} y 手指移动到的坐标
   * @param {*} currentGraph 当前图层的信息
   */
  transform(px, py, x, y, currentGraph) {
    // 获取选择区域的宽度高度
    if (this.type === 'text') {
      this.ctx.setFontSize(this.fontSize);
      const textWidth = this.ctx.measureText(this.text).width;
      const textHeight = this.fontSize + 10;
      this.w = textWidth;
      this.h = textHeight;
      // 字体区域中心点不变，左上角位移
      this.x = this.centerX - textWidth / 2;
      this.y = this.centerY - textHeight / 2;
    } else {
      this.centerX = this.x + this.w / 2;
      this.centerY = this.y + this.h / 2;
    }

    const diffXBefore = px - this.centerX;
    const diffYBefore = py - this.centerY;
    const diffXAfter = x - this.centerX;
    const diffYAfter = y - this.centerY;

    const angleBefore = (Math.atan2(diffYBefore, diffXBefore) / Math.PI) * 180;
    const angleAfter = (Math.atan2(diffYAfter, diffXAfter) / Math.PI) * 180;

    // 旋转的角度
    if (ROTATE_ENABLED) {
      this.rotate = currentGraph.rotate + angleAfter - angleBefore;
    }

    const lineA = Math.sqrt(
      Math.pow(this.centerX - px, 2) + Math.pow(this.centerY - py, 2)
    );
    const lineB = Math.sqrt(
      Math.pow(this.centerX - x, 2) + Math.pow(this.centerY - y, 2)
    );
    if (this.type === 'image') {
      let resize_rito = lineB / lineA;
      let new_w = currentGraph.w * resize_rito;
      let new_h = currentGraph.h * resize_rito;

      if (currentGraph.w < currentGraph.h && new_w < this.MIN_WIDTH) {
        new_w = this.MIN_WIDTH;
        new_h = (this.MIN_WIDTH * currentGraph.h) / currentGraph.w;
      } else if (currentGraph.h < currentGraph.w && new_h < this.MIN_WIDTH) {
        new_h = this.MIN_WIDTH;
        new_w = (this.MIN_WIDTH * currentGraph.w) / currentGraph.h;
      }

      this.w = new_w;
      this.h = new_h;
      this.x = currentGraph.x - (new_w - currentGraph.w) / 2;
      this.y = currentGraph.y - (new_h - currentGraph.h) / 2;
    } else if (this.type === 'text') {
      const fontSize = currentGraph.fontSize * ((lineB - lineA) / lineA + 1);
      this.fontSize = fontSize <= this.MIN_FONTSIZE ? this.MIN_FONTSIZE : fontSize;

      // 旋转位移后重新计算坐标
      this.ctx.setFontSize(this.fontSize);
      const textWidth = this.ctx.measureText(this.text).width;
      const textHeight = this.fontSize + 10;
      this.w = textWidth;
      this.h = textHeight;
      // 字体区域中心点不变，左上角位移
      this.x = this.centerX - textWidth / 2;
      this.y = this.centerY - textHeight / 2;
    }
  }
  toPx(rpx) {
    return rpx * this.factor;
  }
}
