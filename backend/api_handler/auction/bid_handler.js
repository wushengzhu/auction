const { Bid } = require("../../models/enum_status");
const { bidModel, idsModel, bidSchema,publishModel } = require("../../schema/index");
const { Util, queryFilter } = require("../../utils/util");

exports.save = async (req, res) => {
  let bidInfo = req.body;
  // bidInfo.Publish = await publishModel.findOne({Id:bidInfo?.PublishId});
  if (Util.isUndefinedOrNullOrWhiteSpace(bidInfo.Id)) {
    // 实现Id的自增
    const ids = await idsModel.findOneAndUpdate(
      { Name: "BidRecord" },
      { $inc: { Id: 1 } }
    );
    bidInfo.Id = ids.Id;
    bidInfo.OperateTime = new Date();
    bidInfo.Status = Bid.Leading;
    bidModel.create(bidInfo, async (err, results)=>{
      if (err) {
        console.log("竞价失败!");
      }
      // 存储主表Id
      // Mongoose 在收到回调或 await 时执行查询。如果您使用 await 并传递回调，则此查询将执行两次
      // MongooseError: Query was already executed: auction_publishs.updateOne({ Id: 1 }, { '$set': { BidRecord:...
      await publishModel.updateOne({ Id: results.PublishId },{ $set:{ BidRecord: results._id}})
      await bidModel.updateMany({Id:{$ne:results.Id}},{$set:{ Status:Bid.Fail}})
      return res.send({
        Code: 200,
        Message: "竞价成功！",
        Data: results,
      });
    });
  } else {
    bidModel.updateOne(
      { Id: bidInfo.Id },
      { $set: bidInfo },
      function (err, results) {
        if (err) {
          console.log("更新失败!");
        }
        publishModel.updateOne({ Id: results.PublishId },{ $set:{ BidRecord: results._id}})
        return res.send({
          Code: 200,
          Message: "更新成功！",
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
    .limit(pageSize).sort({Id:-1}); // id降序处理
};
