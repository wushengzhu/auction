const { userModel, idsModel, userSchema } = require("../../schema/index");
const bcrypt = require("bcryptjs");
const token = require("../../utils/token");
const { Util, queryFilter } = require("../../utils/util");

exports.loginUser = (req, res) => {
  // 接收表单数据
  const userInfo = req.body;
  userModel.findOne({ Account: userInfo.Account }, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    // 查询findMAny语句多条数据的时候就会出现数组，否则就是单个对象
    if (results === "" || results === "undefined") {
      return res.cc("登录失败！");
    }
    // 比较密码
    const comparepwd = bcrypt.compareSync(userInfo.Password, results.Password);
    if (!comparepwd) {
      return res.cc("用户名或密码验证不通过，登录失败！");
    }
    // 剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
    const user = {
      UserName: results.UserName,
      UserId: results.UserId,
      Id: results.Id,
    };
    //
    const tokenStr = token.encrypt(user, "10h");
    return res.send({
      Code: 200,
      Message: "登录成功！",
      Data: results.Id,
      // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
      Token: "Bearer " + tokenStr,
    });
  });
  // userModel.create(userInfo).then((doc) => {
  //     console.log(doc);
  // }).catch((err) => {
  // });
};

exports.saveUser = async (req, res) => {
  const userInfo = req.body;
  if (!userInfo.Account || !userInfo.Password) {
    return res.send({ status: 400, message: "用户名或密码不能为空！" });
  }
  if (Util.isUndefinedOrNullOrWhiteSpace(userInfo.Id)) {
    userModel.find(
      {
        Account: userInfo.Account,
      },
      (err, results) => {
        if (err) {
          return res.send({ status: 400, message: err.message });
        }
        // 用户名被占用
        if (results.length > 0) {
          return res.send({ status: 400, message: "用户名已经被占用" });
        }
      }
    );
    // 实现Id的自增
    const ids = await idsModel.findOneAndUpdate(
      { Name: "User" },
      { $inc: { Id: 1 } }
    );
    userInfo.Id = ids.Id;
    userInfo.CreateTime = new Date();
    // 密码加密，只在注册时候使用
    userInfo.Password = bcrypt.hashSync(userInfo.Password, 10);
    userModel.create(userInfo, function (err, results) {
      if (err) {
        console.log("添加用户失败!");
      }
      res.send({
        Code: 200,
        Message: "添加用户成功！",
        Data: results,
      });
    });
  } else {
    userModel.updateOne(
      { Id: userInfo.Id },
      { $set: userInfo },
      function (err, results) {
        if (err) {
          console.log("更新用户信息失败!");
        }
        res.send({
          Code: 200,
          Message: "更新用户信息成功！",
          Data: results,
        });
      }
    );
  }
};

exports.deleteUser = (req, res) => {
  const id = req.query.id;
  userModel.deleteOne({ Id: id }, (err, results) => {
    if (err) {
      console.log("删除用户失败！");
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

exports.getUserById = (req, res) => {
  const { userId } = req.query;
  userModel.findOne({ Id: userId }, (err, results) => {
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

exports.getUserInfoByName = (req, res) => {
  const account = req.query.account;
  userModel.findOne({ UserId: account }, (err, results) => {
    if (err) {
      console.log("查询失败！");
    }
    if (results.length > 0) {
      return res.send({
        Code: 200,
        Message: "用户名已存在！",
        Data: true,
      });
    }
    return res.send({
      Code: 200,
      Message: "",
      Data: false,
    });
  });
};

// 少量数据使用skip、limit问题不大，如果是大量数据的话就要优化了
exports.getUserList = async (req, res) => {
  const { filters, curPage, pageSize } = req.body;
  const skipData = (curPage - 1) * pageSize;
  let queryItem = queryFilter(filters, userSchema.obj);
  const totalDataLength = await userModel.find(queryItem).count();
  userModel
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
