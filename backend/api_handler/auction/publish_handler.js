const {
  publishModel,
  idsModel,
  publishSchema,
} = require('../../schema/index');
const { Util, queryFilter } = require('../../utils/util');

exports.save = async (req, res) => {
  let publishInfo = req.body;
  if (Util.isUndefinedOrNullOrWhiteSpace(publishInfo.Id)) {
    publishModel.find(
      {
        Title: publishInfo.Title,
      },
      (err, results) => {
        if (err) {
          return res.send({ status: 400, Message: err.message });
        }
        // 用户名被占用
        if (results.length > 0) {
          return res.send({ status: 400, Message: '标题已经存在' });
        }
      }
    );
    // 实现Id的自增
    const ids = await idsModel.findOneAndUpdate(
      { Name: 'Publish' },
      { $inc: { Id: 1 } }
    );
    publishInfo.Id = ids.Id;
    publishInfo.CreateTime = new Date();
    publishModel.create(publishInfo, function (err, results) {
      if (err) {
        console.log('添加物品失败!');
      }
           // publish表存储主表的Id
    //  publishModel.updateOne({ Id: results.Id },{ $set:{ Material: results.MaterialId}})
      return res.send({
        Code: 200,
        Message: '添加物品成功！',
        Data: results,
      });
    });
  } else {
    publishModel.updateOne(
      { Id: publishInfo.Id },
      { $set: publishInfo },
      function (err, results) {
        if (err) {
          console.log('更新物品信息失败!');
        }
        return res.send({
          Code: 200,
          Message: '更新物品信息成功！',
          Data: results,
        });
      }
    );
  }
};

exports.delete = (req, res) => {
  const id = req.query.publishId;
  publishModel.deleteOne({ Id: id }, (err, results) => {
    if (err) {
      console.log('删除物品失败！');
    }
    if (results.deletedCount === 1) {
      res.send({
        Code: 200,
        Message: '删除成功！',
        Data: true,
      });
    }
  });
};

exports.getById = async (req, res) => {
  const { publishId } = req.query;
  publishModel.findOne({ Id: publishId }, async (err, results) => {
    if (err) {
      console.log('查询失败！');
    } else {
      res.send({
        Code: 200,
        Message: '查询成功！',
        Data: results,
      });
    }
  }).populate('Material', null, null, { strictPopulate: false })
  .populate('ReceiveRecord', null, null, { strictPopulate: false })
  .populate('BidRecord', null, null, { strictPopulate: false });
};

exports.updateStatus = async (req, res) => {
  const { ids, status } = req.body;
  if (!Util.IsNullOrEmpty(ids)) {
    ids.forEach((item) => {
      publishModel.updateOne(
        { Id: +item },
        { $set: { Status: status } },
        async (err, results) => {
          if (err) {
            res.send({
              Code: 500,
              Message: err,
              Data: false,
            });
          } else {
            res.send({
              Code: 200,
              Message: '',
              Data: true,
            });
          }
        }
      );
    });
  }
};

exports.getList = async (req, res) => {
  const { filters, curPage, pageSize } = req.body;
  const skipData = (curPage - 1) * pageSize;
  let queryItem = queryFilter(filters, publishSchema.obj);
  const totalDataLength = await publishModel.find(queryItem).count();
  // strictPopulate属性作用是允许 Mongoose 忽略 schema 中没有定义的属性，不会抛出异常。
  publishModel
    .find(queryItem)
    .populate('Material', null, null, { strictPopulate: false })
    .populate('ReceiveRecord', null, null, { strictPopulate: false })
    .populate('BidRecord', null, null, { strictPopulate: false })
    .skip(skipData)
    .limit(pageSize)
    .exec((err, results) => {
      if (err) {
        console.log(err);
        console.log('获取列表失败！');
      } else {
        res.send({
          Code: 200,
          Message: '获取列表成功！',
          Data: {
            Data: results,
            Total: totalDataLength,
          },
        });
      }
    });
};
