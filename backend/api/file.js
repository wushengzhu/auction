const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const config = require("../utils/config");
const { queryFilter } = require("../utils/util");
const multiparty = require("multiparty");
const { fileModel, idsModel, fileSchema } = require("../schema/index");
const { Buffer } = require("buffer");
const fst = require("fs-extra");
const {
  getUploadedList,
  extractExt,
  mergeFiles,
  Util,
} = require("../utils/util");
const STATIC_FILES = path.join(process.cwd(), "/public/uploads/attachment");
const STATIC_TEMP = path.join(process.cwd(), "/public/uploads/temporary");
// Temporary path to upload files
// process.cwd()返回的是nodejs工作目录
// __dirname返回的是当前文件的目录
// const time = Date.now() + parseInt(Math.random() * 999) + parseInt(Math.random() * 2222);
// // 拼成图片名
// const keepname = time + '.' + extname;
// console.log(keepname);
const upload = multer({
  dest: path.join(process.cwd(), "/public/uploads/images"),
});

// file是标签名
// 前端要设请求头的：'multipart/form-data'
router.post("/Image/Upload", (req, res) => {
  //接收前台POST过来的base64
  const imgData = req.body.imageData;
  const imgName = req.body.imageName;
  //过滤data:URL
  const base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
  //  var dataBuffer = new Buffer(base64Data, 'base64'); // 解码图片
  const filename = path.join(process.cwd(), "/public/uploads/images", imgName);
  const dataBuffer = Buffer.from(base64Data, "base64"); // 这是另一种写法
  fs.writeFile(filename, dataBuffer, (err) => {
    if (err) {
      return res.send("写入失败");
    }
    return res.send({
      Code: 200,
      msg: "上传成功！",
      data: `http://127.0.0.1:${config.port}/uploads/images/${imgName}`,
    }); // 成功信息
  });
});

router.post("/Attachment/Verify", async (req, res) => {
  // const data = await resolvePost(req);
  const { fileName, chunkHashName } = req.body;
  const ext = extractExt(fileName);
  // const filePath = path.resolve(STATIC_TEMP, `${chunkHashName}${ext}`)
  const filePath = path.resolve(STATIC_FILES, `${chunkHashName}${ext}`);
  // 文件是否已存在
  let uploaded = false;
  let uploadedList = [];
  if (fst.existsSync(filePath)) {
    uploaded = true;
  } else {
    uploadedList = await getUploadedList(
      path.resolve(STATIC_TEMP, chunkHashName)
    );
  }
  return res.send({
    Code: 200,
    // msg: '上传成功！',
    // data: JSON.stringify({ uploaded, uploadedList })
    data: {
      uploaded,
      uploadedList, // 过滤诡异的隐藏文件
    },
  }); // 成功信息
});

router.post("/Attachment/UploadChunk", (req, res) => {
  const multipart = new multiparty.Form();
  multipart.parse(req, async (err, field, file) => {
    if (err) {
      console.log(err);
      return;
    }
    const [chunk] = file.chunk;
    const [chunkName] = field.chunkName;
    const [fileName] = field.fileName;
    const [fileHash] = field.fileHash;
    const filePath = path.resolve(STATIC_TEMP, `${fileHash}/${chunkName}`);
    const mergePath = path.resolve(STATIC_FILES, `${fileHash}/${chunkName}`);
    const chunkDir = path.resolve(STATIC_TEMP, fileHash);

    if (fst.existsSync(filePath) || fst.existsSync(mergePath)) {
      return res.send({
        Code: 200,
        msg: "文件已存在！",
        data: {},
      }); // 成功信息
    }

    if (!fst.existsSync(chunkDir)) {
      await fst.mkdirs(chunkDir);
    }
    await fst.move(chunk.path, `${chunkDir}/${chunkName}`);
    return res.send({
      Code: 200,
      msg: "文件分片已上传",
      data: {},
    }); // 成功信息;
  });
});

const mergeFileChunk = async (filePath, fileHash, size) => {
  const chunkDir = path.resolve(STATIC_TEMP, fileHash);
  if (fst.existsSync(filePath)) {
    return;
  }
  // 读chunkDir当前路径下的内容
  let chunkPaths = await fst.readdir(chunkDir);
  // 根据切片下标进行排序
  // 否则直接读取目录的获得的顺序可能会错乱
  chunkPaths.sort((a, b) => a.split("-")[1] - b.split("-")[1]);
  chunkPaths = chunkPaths.map((cp) => path.resolve(chunkDir, cp)); // 转成文件路径
  await mergeFiles(chunkPaths, filePath, size);
};

router.post("/Attachment/MergeChunk", async (req, res) => {
  // const data = await resolvePost(req)
  const { fileHash, fileName, size } = req.body;
  const ext = extractExt(fileName);
  const filePath = path.resolve(STATIC_FILES, `${fileHash}${ext}`);
  const tempDir = path.resolve(STATIC_TEMP, fileHash);
  await mergeFileChunk(filePath, fileHash, size);
  if (fs.existsSync(tempDir)) {
    // 删除分片目录
    fs.rmdirSync(tempDir);
  }
  return res.send({
    Code: 200,
    msg: "文件已上传",
    data: {},
  }); // 成功信息;
});

router.post("/Attachment/Upload", async (req, res) => {
  // const data = await resolvePost(req)
  const { fileHash, fileName, size } = req.body;
  const ext = extractExt(fileName);
  const filePath = path.resolve(STATIC_FILES, `${fileHash}${ext}`);

  await mergeFileChunk(filePath, fileHash, size);
  if (fs.existsSync(tempDir)) {
    // 删除分片目录
    fs.rmdirSync(tempDir);
  }
  return res.send({
    Code: 200,
    msg: "文件已上传",
    data: {},
  }); // 成功信息;
});

router.get("/Attachment/Delete", async (req, res) => {
  const { id } = req.query;
  if (Util.isUndefinedOrNullOrWhiteSpace(id)) {
    return res.send({ status: 400, message: "当前文件不存在！" });
  }
  const { FileHash, OriginName } = await fileModel.findOne({ Id: id });
  const ext = extractExt(OriginName);
  const deleteFile = path.resolve(STATIC_FILES, `${FileHash}${ext}`);
  if (fst.existsSync(deleteFile)) {
    fs.unlinkSync(deleteFile);
  }
  fileModel.deleteOne({ Id: id }, (err, results) => {
    if (err) {
      console.log("删除失败！");
    }
    if (results.deletedCount === 1) {
      res.send({
        Code: 200,
        Message: "删除成功！",
        Data: true,
      });
    }
  });
});

router.get("/Attachment/Download", async (req, res) => {
  const { id } = req.query;
  if (Util.isUndefinedOrNullOrWhiteSpace(id)) {
    return res.send({ status: 400, message: "当前文件不存在！" });
  }
  const { FileHash, OriginName, FileName } = await fileModel.findOne({
    Id: id,
  });
  const ext = extractExt(OriginName);
  const filePath = path.resolve(STATIC_FILES, `${FileHash}${ext}`);
  if (!fs.existsSync(filePath)) {
    return res.send({
      Code: 200,
      Message: "下载失败！",
    });
  }
  const fileStream = fs.createReadStream(filePath);
  res.writeHead(200, {
    "Content-Type": "application/force-download",
    "Content-Disposition": "attachment; filename=" + FileHash,
  });
  fileStream.pipe(res);
  // fs.readFile(filePath, 'utf8', function (err, dataStr) {
  //   // 如果读取成功，则err的值为null，dataStr会显示文件的文本内容
  //   // 如果读取失败，err的值为错误对象，展示出错误信息，dataStr的值为undefined
  //   if (err) {
  //     console.log('下载失败!')
  //   }
  //   return res.send({
  //     Code: 200,
  //     Message: '下载成功！',
  //     Data: dataStr,
  //   })
  // })
});

router.post("/Attachment/Save", async (req, res) => {
  const attachmentInfo = req.body;
  if (Util.isUndefinedOrNullOrWhiteSpace(attachmentInfo.Id)) {
    // 实现Id的自增
    const ids = await idsModel.findOneAndUpdate(
      { Name: "File" },
      { $inc: { Id: 1 } }
    );
    attachmentInfo.Id = ids.Id;
    attachmentInfo.CreateTime = new Date();
    fileModel.create(attachmentInfo, function (err, results) {
      if (err) {
        console.log("添加失败!");
      }
      return res.send({
        Code: 200,
        Message: "添加成功！",
        Data: results,
      });
    });
  } else {
    fileModel.updateOne(
      { Id: attachmentInfo.Id },
      { $set: attachmentInfo },
      function (err, results) {
        if (err) {
          console.log("更新失败!");
        }
        return res.send({
          Code: 200,
          Message: "更新成功！",
          Data: results,
        });
      }
    );
  }
});

router.post("/Attachment/GetFileList", async (req, res) => {
  const { modCode, objectId } = req.body;
  fileModel.find({ ModCode: modCode, ObjectId: objectId }, (err, results) => {
    if (err) {
      console.log("获取列表失败！");
    } else {
      res.send({
        Code: 200,
        Message: "获取列表成功！",
        Data: results,
      });
    }
  });
});

router.post("/Attachment/GetList", async (req, res) => {
  const { filters, curPage, pageSize } = req.body;
  const skipData = (curPage - 1) * pageSize;
  let queryItem = queryFilter(filters, fileSchema.obj);
  const totalDataLength = await fileModel.find(queryItem).count();
  fileModel
    .find(queryItem, (err, results) => {
      if (err) {
        console.log("获取列表失败！");
      } else {
        res.send({
          Code: 200,
          Message: "获取列表成功！",
          Data: {
            Data: results,
            Total: totalDataLength,
          },
        });
      }
    })
    .skip(skipData)
    .limit(pageSize);
});

// 将路由对象共享出去
module.exports = router;
