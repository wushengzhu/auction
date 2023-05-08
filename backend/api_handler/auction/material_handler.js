const {
  materialModel,
  idsModel,
  materialSchema,
} = require("../../schema/index");
const { Util, queryFilter } = require("../../utils/util");

exports.save = async (req, res) => {
  const materialInfo = req.body;
  if (Util.isUndefinedOrNullOrWhiteSpace(materialInfo.Id)) {
    materialModel.find(
      {
        Name: materialInfo.Name,
      },
      (err, results) => {
        if (err) {
          return res.send({ status: 400, message: err.message });
        }
        // 用户名被占用
        if (results.length > 0) {
          return res.send({ status: 400, message: "物品名已经存在" });
        }
      }
    );
    // 实现Id的自增
    const ids = await idsModel.findOneAndUpdate(
      { Name: "Material" },
      { $inc: { Id: 1 } }
    );
    materialInfo.Id = ids.Id;
    materialInfo.CreateTime = new Date();
    materialModel.create(materialInfo, function (err, results) {
      if (err) {
        console.log("添加物品失败!");
      }
      res.send({
        Code: 200,
        Message: "添加物品成功！",
        Data: results,
      });
    });
  } else {
    materialModel.updateOne(
      { Id: materialInfo.Id },
      { $set: materialInfo },
      function (err, results) {
        if (err) {
          console.log("更新物品信息失败!");
        }
        res.send({
          Code: 200,
          Message: "更新物品信息成功！",
          Data: results,
        });
      }
    );
  }
};

exports.delete = (req, res) => {
  const id = req.query.id;
  materialModel.deleteOne({ Id: id }, (err, results) => {
    if (err) {
      console.log("删除物品失败！");
    }
    if (results.deletedCount === 1) {
      res.send({
        Code: 200,
        Message: "删除成功！",
        Data: true,
      });
    }
  });
};

exports.getById = (req, res) => {
  const { materialId } = req.query;
  materialModel.findOne({ Id: materialId }, (err, results) => {
    if (err) {
      console.log("查询失败！");
    } else {
      res.send({
        Code: 200,
        Message: "查询成功！",
        Data: results,
      });
    }
  });
};

exports.getList = async (req, res) => {
  const { filters, curPage, pageSize } = req.body;
  const skipData = (curPage - 1) * pageSize;
  let queryItem = queryFilter(filters, materialSchema.obj);
  const totalDataLength = await materialModel.find(queryItem).count();
  materialModel
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
};
