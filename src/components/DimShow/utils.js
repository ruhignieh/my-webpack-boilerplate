/**
 * 获取图片信息（宽度高度）
 * by ruhignieh 2020-05-06
 */
function _getcanvasheight(
  width,
  height,
  swidth,
  sheight,
  pwidth,
  pheight,
  canvasWidth,
  canvasHeight
) {
  if (height == 'auto') {
    let tmp = _getcanvaswidth(
      width,
      height,
      swidth,
      sheight,
      pwidth,
      pheight,
      canvasWidth,
      canvasHeight
    );
    canvasHeight = (tmp.canvasWidth * pheight) / pwidth;
    height = canvasHeight + 'px';
    /**if (width == "auto") {
      canvasHeight = sheight;
      height = sheight + "px";
      canvasWidth = swidth;
    }*/
  } else if (height.indexOf('%') >= 0) {
    canvasHeight = (parseFloat(height) / 100) * sheight;
    height = (parseFloat(height) / 100) * sheight + 'px';
  } else if (height.indexOf('rpx') >= 0) {
    canvasHeight = (swidth / 750) * parseFloat(height);
  } else if (height.indexOf('px') >= 0) {
    canvasHeight = parseFloat(height);
  }
  return { height: height, canvasHeight: canvasHeight };
}

function _getcanvaswidth(
  width,
  height,
  swidth,
  sheight,
  pwidth,
  pheight,
  canvasWidth
  // canvasHeight
) {
  if (width == 'auto') {
    if (height == 'auto') {
      //canvasWidth = canvasHeight * pwidth / pheight;
      width = '100%';
    } else {
      canvasWidth = (sheight * pwidth) / pheight;
      if (canvasWidth > swidth) {
        canvasWidth = swidth;
      }
    }
  }
  if (width.indexOf('%') >= 0) {
    canvasWidth = (parseFloat(width) / 100) * swidth;
  } else if (width.indexOf('rpx') >= 0) {
    canvasWidth = (swidth / 750) * parseFloat(width);
  } else if (width.indexOf('px') >= 0) {
    canvasWidth = parseFloat(width);
  }
  return { width: width, canvasWidth: canvasWidth };
}

function getcanvassize(
  width,
  height,
  swidth,
  sheight,
  pwidth,
  pheight,
  canvasWidth,
  canvasHeight
) {
  let w = _getcanvaswidth(
    width,
    height,
    swidth,
    sheight,
    pwidth,
    pheight,
    canvasWidth,
    canvasHeight
  );
  let h = _getcanvasheight(
    width,
    height,
    swidth,
    sheight,
    pwidth,
    pheight,
    canvasWidth,
    canvasHeight
  );
  if (width == 'auto') {
    w.canvasWidth = (h.canvasHeight * pwidth) / pheight;
    //width = "100%";
    if (w.canvasWidth > swidth) {
      w.canvasWidth = swidth;
    }
  }
  return {
    width: w.width,
    canvasWidth: w.canvasWidth,
    height: h.height,
    canvasHeight: h.canvasHeight,
    sysWidth: swidth,
    sysHeight: sheight,
    picWidth: pwidth,
    picHeight: pheight
  };
}

export default {
  getcanvassize: getcanvassize
};
