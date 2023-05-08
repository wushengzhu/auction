const {
  idsModel,
  loginRecordModel,
  loginRecordSchema,
} = require("../schema/index");
const { Util } = require("../utils/util");

exports.save = async (req, res) => {
  const saveInfo = req.body;
  // 实现Id的自增
  const ids = await idsModel.findOneAndUpdate(
    { Name: "LoginRecord" },
    { $inc: { Id: 1 } }
  );
  saveInfo.Id = ids.Id;
  saveInfo.CreateTime = new Date();
  loginRecordModel.create(saveInfo, function (err, results) {
    if (err) {
      console.log("添加失败!");
    }
    res.send({
      Code: 200,
      Message: "",
      Data: results,
    });
  });
};

// 少量数据使用skip、limit问题不大，如果是大量数据的话就要优化了
exports.getList = async (req, res) => {
  const { filters, curPage, pageSize } = req.body;
  const skipData = (curPage - 1) * pageSize;
  let queryItem = {};
  if (!Util.IsNullOrEmpty(filters)) {
    // 模糊搜索${filterValue}
    // 正则表达式只能为 {Account:  /Admin/i }或$regex:Admin
    for (let key of Object.keys(loginRecordSchema.obj)) {
      if (key !== "Id") {
        queryItem[key];
      }
    }

    for (let key of Object.keys(queryItem)) {
      const objx = queryItem[key];
      if (!objx) {
        delete objx;
      }
    }
    filters.forEach((item) => {
      queryItem[item.field] = { $regex: eval(`/${item.value}+/i`) };
    });
  }
  const totalDataLength = await loginRecordModel.find(queryItem).count();
  loginRecordModel
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
