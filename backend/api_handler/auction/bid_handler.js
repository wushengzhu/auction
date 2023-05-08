const { bidModel, idsModel, bidSchema } = require("../../schema/index");
const { Util, queryFilter } = require("../../utils/util");

exports.save = async (req, res) => {
  let bidInfo = req.body;
  //   bidInfo.RemainTime = {
  //     RemainTime: { $subtract: [bidInfo.EndTime, bidInfo.StartTime] },
  //   };
  if (Util.isUndefinedOrNullOrWhiteSpace(bidInfo.Id)) {
    bidModel.find(
      {
        Name: bidInfo.Name,
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
    bidInfo.Id = ids.Id;
    bidInfo.CreateTime = new Date();
    // const soldCount = await materialModel.find({Status:3}).count();
    // materialModel.updateOne({Id:bidInfo.MaterialId},  { $set: {RemainQuantity:bidInfo.MaterialQuantity-soldCount} })
    bidModel.create(bidInfo, function (err, results) {
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
    bidModel.updateOne(
      { Id: bidInfo.Id },
      { $set: bidInfo },
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
  bidModel.deleteOne({ Id: id }, (err, results) => {
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
  bidModel.findOne({ Id: publishId }, async (err, results) => {
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
  let queryItem = queryFilter(filters, bidSchema.obj);
  const totalDataLength = await bidModel.find(queryItem).count();
  bidModel
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
