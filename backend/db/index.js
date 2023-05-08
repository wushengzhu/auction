const mongoose = require('mongoose');
const db_url = 'mongodb://localhost:27017/auction';// mongodb://数据库ip地址/数据库名 如果端口号默认27017，可以省略不写
mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true });
// 监听数据库连接状态
mongoose.connection.once("open", function () {
    console.log("数据库连接成功！");
})

// 监听数据库断开状态：通过mongoose.disconnection
mongoose.connection.once("close", function () {
    console.log("数据库已断开！");
})

module.exports = mongoose;
