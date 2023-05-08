const {
  publichModel,
  idsModel,
  materialModel,
  publishSchema,
} = require("../../schema/index");
const { Util, queryFilter } = require("../../utils/util");

exports.save = async (req, res) => {
  let publishInfo = req.body;
  //   publishInfo.RemainTime = {
  //     RemainTime: { $subtract: [publishInfo.EndTime, publishInfo.StartTime] },
  //   };
  if (Util.isUndefinedOrNullOrWhiteSpace(publishInfo.Id)) {
    publichModel.find(
      {
        Name: publishInfo.Name,
      },
      (err, results) => {
        if (err) {
          return res.send({ status: 400, Message: err.message });
        }
        // 用户名被占用
        if (results.length > 0) {
          return res.send({ status: 400, Message: "物品名已经存在" });
        }
      }
    );
    // 实现Id的自增
    const ids = await idsModel.findOneAndUpdate(
      { Name: "Publish" },
      { $inc: { Id: 1 } }
    );
    publishInfo.Id = ids.Id;
    publishInfo.CreateTime = new Date();
    // const soldCount = await materialModel.find({Status:3}).count();
    // materialModel.updateOne({Id:publishInfo.MaterialId},  { $set: {RemainQuantity:publishInfo.MaterialQuantity-soldCount} })
    publichModel.create(publishInfo, function (err, results) {
      if (err) {
        console.log("添加物品失败!");
      }
      return res.send({
        Code: 200,
        Message: "添加物品成功！",
        Data: results,
      });
    });
  } else {
    publichModel.updateOne(
      { Id: publishInfo.Id },
      { $set: publishInfo },
      function (err, results) {
        if (err) {
          console.log("更新物品信息失败!");
        }
        return res.send({
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
  publichModel.deleteOne({ Id: id }, (err, results) => {
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

exports.getById = async (req, res) => {
  const { publishId } = req.query;
  publichModel.findOne({ Id: publishId }, async (err, results) => {
    if (err) {
      console.log("查询失败！");
    } else {
      const material = await materialModel.find({ Id: results?.MaterialId });
      results.Material = !Util.IsNullOrEmpty(material) ? material[0] : {};
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
  let queryItem = queryFilter(filters, publishSchema.obj);
  const totalDataLength = await publichModel.find(queryItem).count();
  publichModel
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
