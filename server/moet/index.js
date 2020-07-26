const SW = require("./senseWords");
const designTemplate = require("./design");
const zlib = require("zlib");

exports.main = async () => {
  // console.log(process.env.MTdomain);
  return "hello world";
};

const formDocument = (compressedJSON) => {
  const url = `https://uds.yinshida.com.cn/v2/transient/zPn5HmwqZl5RKCpjnmu5xaiG3b4i27L6%40clients?document=${compressedJSON}&type=preview`;
  return encodeURIComponent(url);
};

const renderingUrl = (encodedTransientInstruction, encodedScene) => {
  const url = `https://origin-rendering.yinshida.com.cn/v1/uds/preview?width=1000&format=png&instructions_uri=${encodedTransientInstruction}&scene=${encodedScene}`;
  return url;
};

const bottleScene = {
  front: encodeURIComponent(
    "https://scene.yinshida.com.cn/v1/scenes/901a291f-eb9f-4f18-aca3-08ee276b2566"
  ),
  back: encodeURIComponent(
    "https://scene.yinshida.com.cn/v1/scenes/4df95c51-9369-4f2b-9c1f-4b605f8e6c84"
  ),
};

exports.getDesign = (context) => {
  const data = context.data;
  // const params = {
  //   // url:
  //   // cropperSize:
  //   // text:
  //   // fontFamily
  // }
  return new Promise((resolve, reject) => {
    const fetchDesign = JSON.stringify(designTemplate(data.params));
    // fetchDesign.document.surfaces[0];
    zlib.deflateRaw(fetchDesign, (err, buffer) => {
      if (!err) {
        const getBtoa = encodeURIComponent(buffer.toString("base64"));
        const documentUrl = formDocument(getBtoa);
        const getRenderingUrl = renderingUrl(
          documentUrl,
          bottleScene[data.params.positon]
        );
        resolve({ result: { data: getRenderingUrl }, success: true });
      } else {
        reject({ success: false });
      }
    });
  });
};

exports.getToken = async (context) => {
  try {
    const result = await context.cloud.httpApi.invoke({
      domain: process.env.MTdomain,
      path: "/api/authentication/token",
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: {
        clientId: process.env.ClientId,
        clientSecret: process.env.ClientSecret,
      },
    });
    const { flag } = JSON.parse(result);
    if (flag === 10) {
      return { success: true, result: JSON.parse(result) };
    }
    return { success: false, result: JSON.parse(result) };
  } catch (e) {
    return {
      success: false,
      result: e,
    };
  }
};

exports.getDetail = async (context) => {
  try {
    const result = await context.cloud.httpApi.invoke({
      domain: process.env.MTdomain,
      path: `/api/goods/sku/tmall/${context.data.id}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: context.data.token,
      },
    });
    const { flag } = JSON.parse(result);
    if (flag === 10) {
      return { success: true, result: JSON.parse(result), data: context.data };
    }
    return { success: false, result: JSON.parse(result) };
  } catch (e) {
    return {
      success: false,
      result: e,
    };
  }
};

exports.getImage = async (context) => {
  try {
    const result = await context.cloud.httpApi.invoke({
      domain: process.env.MTdomain,
      path: "/api/upload/mainland",
      method: "POST",
      params: {
        uri: context.data.uri,
      },
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: context.data.token,
      },
    });
    const { flag } = JSON.parse(result);
    if (flag === 10) {
      return { success: true, result: JSON.parse(result), data: context.data };
    }
    return { success: false, result: JSON.parse(result), data: context.data };
  } catch (e) {
    return {
      success: false,
      result: e,
    };
  }
};

exports.saveDesign = async (context) => {
  try {
    // const data = context.data;
    const result = await context.cloud.httpApi.invoke({
      domain: process.env.MTdomain,
      path: "/api/design/savedesign",
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: context.data.token,
      },
      body: context.data.body,
    });
    const { flag } = JSON.parse(result);
    if (flag === 10) {
      return { success: true, result: JSON.parse(result), data: context.data };
    }
    return { success: false, result: JSON.parse(result), data: context.data };
  } catch (e) {
    return {
      success: false,
      result: e,
    };
  }
};

exports.getDesKey = async (context) => {
  try {
    const result = await context.cloud.httpApi.invoke({
      domain: process.env.MTdomain,
      path: "/api/design/saveuserdesign",
      method: "POST",
      params: {
        designKey: context.data.designKey,
      },
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: context.data.token,
      },
    });
    const { flag } = JSON.parse(result);
    if (flag === 10) {
      return { success: true, result: JSON.parse(result), data: context.data };
    }
    return { success: false, result: JSON.parse(result), data: context.data };
  } catch (e) {
    return {
      success: false,
      result: e,
    };
  }
};

exports.getSensitiveWords = async () => {
  return {
    success: true,
    result: { data: SW },
  };
};

exports.designPreview = async (context) => {
  try {
    const data = context.data;
    const result = await context.cloud.httpApi.invoke({
      domain: process.env.MTdomain,
      path: `/api/tmall/preview/${context.data.id}`,
      method: "GET",
      params: data.params,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: context.data.token,
      },
    });
    const flag = JSON.parse(result).flag;
    if (flag === 10) {
      return { success: true, result: JSON.parse(result) };
    } else {
      return { success: false, result: JSON.parse(result) };
    }
  } catch (e) {
    return {
      success: false,
      result: e,
    };
  }
};

exports.getDomain = async () => {
  return {
    success: true,
    result: { data: process.env.MTdomain },
  };
};
