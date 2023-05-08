const fse = require("fs-extra");
const path = require("path");
const STATIC_TEMP = path.join(process.cwd(), "/public/uploads/temporary");

class Util {
  /**
   * 判断是否为undfined、null
   * @param value
   * @returns
   */
  static isUndefinedOrNull(value) {
    return typeof value === "undefined" || value === null;
  }
  /**
   * 判断是否为undefined、null或仅有空白字符
   */
  static isUndefinedOrNullOrWhiteSpace(value) {
    return (
      typeof value === "undefined" || value === null || /^\s*$/.test(value)
    );
  }
  /**
   * 判断是否为0或空白字符等
   */
  static isZeroOrWhiteSpace(value) {
    if (typeof value === "undefined" || value === null) {
      return true;
    } else if (typeof value === "string") {
      return /^\s*$/.test(value) || value === "0";
    } else if (typeof value === "number") {
      return value === 0;
    } else {
      return false;
    }
  }
  /**
   * 判断是否为整数
   * @param value
   */
  static isInt(value) {
    return typeof value === "number" && value % 1 === 0;
  }

  /**
   * 判断数组是否为Null或者空
   */
  static IsNullOrEmpty(array) {
    if (!Util.isUndefinedOrNull(array)) {
      if (array instanceof Array) {
        if (array.length > 0) {
          return false;
        }
      }
    }
    return true;
  }
}

resolvePost = async (req) =>
  new Promise((resolve) => {
    let chunk = "";
    // req.on(data) 每次发送的数据
    req.on("data", (data) => {
      chunk += data;
    });
    // req.on(end),数据发送完成
    req.on("end", () => {
      resolve(chunk);
      // resolve(JSON.parse(chunk))
    });
  });

// 返回已经上传切片名列表
getUploadedList = async (dirPath) => {
  return fse.existsSync(dirPath)
    ? (await fse.readdir(dirPath)).filter((name) => name[0] !== ".") // 过滤诡异的隐藏文件
    : [];
};

// 截取扩展格式符号，如.jpg
extractExt = (filename) =>
  filename.slice(filename.lastIndexOf("."), filename.length);

const pipeStream = (filePath, writeStream) =>
  new Promise((resolve) => {
    const readStream = fse.createReadStream(filePath);
    readStream.on("end", () => {
      // 删除临时文件夹当前分片内容
      fse.unlinkSync(filePath);
      resolve();
    });
    readStream.pipe(writeStream);
  });

// files 分片路径数组
// dest 合成文件存储路径
// size 分片长度
mergeFiles = async (files, dest, size) => {
  await Promise.all(
    files.map((file, index) =>
      // 遍历分片写入
      pipeStream(
        file,
        // 指定位置创建可写流 加一个put避免文件夹和文件重名
        // hash后不存在这个问题，因为文件夹没有后缀
        // fse.createWriteStream(path.resolve(dest, '../', 'out' + filename), {
        // 快速创建可写流，以将数据写入文件
        fse.createWriteStream(dest, {
          start: index * size,
          end: (index + 1) * size,
        })
      )
    )
  );
};

const queryFilter = (filters, schema) => {
  let queryItem = {};
  if (!Util.IsNullOrEmpty(filters)) {
    // 模糊搜索${filterValue}
    // 正则表达式只能为 {Account:  /Admin/i }或$regex:Admin
    for (let key of Object.keys(schema)) {
      if (key !== "Id") {
        queryItem[key];
      }
    }

    for (let key of Object.keys(queryItem)) {
      const objx = queryItem[key];
      if (!objx) {
        delete queryItem[key];
      }
    }
    filters.forEach((item) => {
      if (item.op === "$regex") {
        queryItem[item.field] = { $regex: eval(`/${item.value}+/i`) };
      } else if (item.op === "$eq") {
        queryItem[item.field] = { $eq: item.value };
      }
    });
  }
  return queryItem;
};

const Utils = {
  Util,
  resolvePost,
  getUploadedList,
  extractExt,
  mergeFiles,
  queryFilter,
};

module.exports = Utils;
