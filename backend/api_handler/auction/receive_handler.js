const { receiveModel, idsModel,publishModel,receiveSchema } = require("../../schema/index");
const { Util, queryFilter } = require("../../utils/util");

exports.save = async (req, res) => {
  let receiveInfo = req.body;
  // receiveInfo.Publish = await publishModel.findOne({Id:receiveInfo?.PublishId});
  if (Util.isUndefinedOrNullOrWhiteSpace(receiveInfo.Id)) {
    // 实现Id的自增
    const ids = await idsModel.findOneAndUpdate(
      { Name: "ReceiveRecord" },
      { $inc: { Id: 1 } }
    );
    receiveInfo.Id = ids.Id;
    receiveInfo.OperateTime = new Date();
    receiveModel.create(receiveInfo, function (err, results) {
      if (err) {
        console.log("竞价失败!");
      }
      // 存储主表Id
      publishModel.updateOne({ Id: results.PublishId },{ $set:{ ReceiveRecord: results._id}},(err,results)=>{
      })
      return res.send({
        Code: 200,
        Message: "竞价成功！",
        Data: results,
      });
    });
  } else {
    receiveModel.updateOne(
      { Id: receiveInfo.Id },
      { $set: receiveInfo },
      function (err, results) {
        if (err) {
          console.log("更新失败!");
        }
        publishModel.updateOne({ Id: results.PublishId },{ $set:{ ReceiveRecord: results._id}})
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
  receiveModel.deleteOne({ Id: id }, (err, results) => {
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
  receiveModel.findOne({ Id: publishId }, async (err, results) => {
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
  let queryItem = queryFilter(filters, receiveSchema.obj);
  const totalDataLength = await receiveModel.find(queryItem).count();
  receiveModel
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
