const express = require("express");
const moment = require("moment");
const cors = require("cors");
const config = require("./utils/config"); // 导入配置文件
const expressJWT = require("express-jwt"); // 解析 token 的中间件
const bodyParser = require("body-parser");
const jwt = require("./utils/token");
const logger = require("morgan");
// const swaggerInstall = require('./utils/swagger/index');
const app = express(); // 创建express 的服务器实例
const apiRouter = require("./api/index");
const fileRouter = require("./api/file");
const schedule = require("node-schedule");

const { publishModel } = require("./schema/index");
const { Util } = require("./utils/util");
const {Publish} = require("./models/enum_status");

app.use(logger("dev"));
// 系统默认大小为100kb
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); // 配置解析application/x-www-form-urlencoded
app.use(cors()); // 将cors注册为全局中间件
app.use(
  expressJWT
    .expressjwt({
      secret: config.jwtSecretKey,
      algorithms: ["HS256"],
      credentialsRequired: false,
    })
    .unless({
      path: [
        "/api/Auction/User/Login",
        "/api/Auction/User/Register",
        "/api/File/Image/Upload",
        /^swagger$/i,
        /^public$/i,
        /^File$/i,
        /^LoginRecord$/i,
      ],
    })
);

// swaggerInstall(app);
app.use(function (req, res, next) {
  // 所有api都需要带token
  const ifValue = jwt.decrypt(req.headers.authorization);
  if (!req.url.includes("Login")) {
    if (ifValue.token) {
      const tokenExp = ifValue.token.exp;
      const curTime = moment(new Date()).diff(
        new Date("1970-1-1 00:00:00"),
        "seconds"
      );
      if (curTime > tokenExp) {
        return res.send({
          msg: "登录过期，请重新登录！",
          Code: 400,
        });
      }
    } else {
    }
  }
  next();
});

// 方便处理失败的结果的中间件,手动封装res.cc()函数
app.use(function (req, res, next) {
  res.cc = (err, status = 1) => {
    return res.send({
      status,
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

// 每分钟的第30秒触发
// *表示对应位任意数都触发，其他类推
// 从左到右通配符依次表示：秒 分 时 日 月 周几
schedule.scheduleJob("30 * * * * *", () => {
  publishModel.find({}, (err, results) => {
    let status = results.Status;
    if (results && results.length > 0) {
      for (let item of results) {
        let remainTime;
        const sTime = +moment().diff(new Date(item.StartTime)); // 默认毫秒
        const eTime = +moment().diff(new Date(item.EndTime));
        if (sTime < 0) {
          // 时间未到
          remainTime = sTime;
        } else if (eTime > 0) {
          // 时间已截止
          remainTime = 0;
        } else if (sTime > 0 && eTime < 0) {
          // 时间未结束
          remainTime = Math.abs(+eTime);
        }

        if(remainTime===0){
          status = Util.IsNullOrEmpty(item?.BidRecord)?Publish.Streamed:Publish.Sold
        }
        publishModel.updateOne(
          { Id: item?.Id },
          {
            $set: {
              RemainTime: remainTime,
              Status:status
            },
          },
          (err, results) => {
            // console.log(results);
          }
        );
      }
    }
  });
});

app.use(express.static("public")); // 配置静态资源目录，通过域名访问
app.use("/api/Auction", apiRouter); // 放在中间件之前就不执行token检查的全局中间件
app.use("/api/File", fileRouter);

app.listen(config.port, function () {
  console.log("api server running at http://127.0.0.1");
});
