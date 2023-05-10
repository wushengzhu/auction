<p align="center">
  <img width="300px" src="https://img.alicdn.com/tfs/TB1g.mWZAL0gK0jSZFtXXXQCXXa-200-200.svg">
    +
  <img width="300px" src="https://img.alicdn.com/tfs/TB1Z0PywTtYBeNjy1XdXXXXyVXa-186-200.svg">
</p>

<p align="center">
  <a href="https://codecov.io/gh/element-plus/element-plus">
     <img src="https://img.shields.io/badge/angular-v15.2.6-brightgreen">
  </a>
   <a href="https://codecov.io/gh/element-plus/element-plus">
     <img src="https://img.shields.io/badge/rxjs-v7.8.0-brightgreen">
  </a>
  <a href="https://codecov.io/gh/element-plus/element-plus">
     <img src="https://img.shields.io/badge/ng--zorro--antd-v15.1.0-brightgreen">
  </a>
  <a href="https://npmcharts.com/compare/element-plus?minimal=true">
    <img src="https://img.shields.io/badge/node-v14.20.0-brightgreen">
  </a>
  <a href="https://codecov.io/gh/element-plus/element-plus">
     <img src="https://img.shields.io/badge/mongoDB-v6.0.0-brightgreen">
  </a>
   <a href="https://codecov.io/gh/element-plus/element-plus">
     <img src="https://img.shields.io/badge/mongoose-v6.4.4-brightgreen">
  </a>
  <a href="https://codecov.io/gh/element-plus/element-plus">
     <img src="https://img.shields.io/badge/express-v4.18.1-brightgreen">
  </a>
  <a href="https://codecov.io/gh/element-plus/element-plus">
     <img src="https://img.shields.io/badge/jsonwebtoken-v8.5.1-brightgreen">
  </a>
  <a href="https://codecov.io/gh/element-plus/element-plus">
     <img src="https://img.shields.io/badge/node--schedule-v2.1.1-brightgreen">
  </a>
  <a href="https://codecov.io/gh/element-plus/element-plus">
     <img src="https://img.shields.io/badge/morgan-v1.10.0-brightgreen">
  </a>
   <a href="https://codecov.io/gh/element-plus/element-plus">
     <img src="https://img.shields.io/badge/ckeditor-v4.0.0-brightgreen">
  </a>
  <br>
</p>

<p align="center">医院廉洁拍卖后台管理系统项目（pc端+mobile端）</p>

- 💪 Angular
- 🔥 Written in TypeScript、 Angular、NG-ZORRO、Nodejs、MongoDB

本系统秉着开源项目原则，系统业务在我们平时技术学习当中应该很熟悉，写下这个系统的目的主要是为了回顾2021.9~2023.9这两年在公司担任前端开发职位学习的知识，为了掌握更多前端知识，系统会不断完善。如果本系统对于您的技术有帮助，希望有想法的伙伴或开源大佬提交pr或issue，让我们一起完善这个系统，路灯哥将感激不尽😀。

## 1 系统准备工作

- 🔎 安装[mongoDB数据库](https://www.mongodb.com/try/download/community-kubernetes-operator)

- 🔎 安装[Studio 3T for MongoDB](https://studio3t.com/download/)
- 🔎 安装[VsCode编辑器](https://code.visualstudio.com/)

> 详细的安装配置就不一一说明了，大家可以适当🔎。

## 2 系统数据库

- **mongodb连接配置**：node搭建的后端需要配置mongoDB，注意地，在启动程序前一定保证，数据库已开启连接，这里引入了mogoose插件：

  ```js
  const mongoose = require('mongoose');
  // 有些情况下需要使用127.0.0.1，暂时不知道什么原因
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
  ```

- **配置schema**：在schema文件中引入配置，数据库中的schema，为数据库对象的集合，schema是mongoose会用到的一种数据模式，可以理解为表结构的定义：每个schema会映射到mongodb中的一个collection。它不具备操作数据库的能力

  ```js
  const mongoose = require("../db/index");
  const Schema = mongoose.Schema;
  ....//详情请看源码
  ```

- **数据表**：数据表不需要一一创建，只要定义schema文件，对不同数据表model进行命名，当我们启动后端服务，将会自动帮我们在数据库创建Collection，通过studio 3t可以看到相应效果。

> 注意地，由于mongoDB中会自动创建_Id，它于mysql等数据库的唯一标识不同，它是一个长字符串的哈希值，所以为了更方便开发，所以本系统单独创建一个数据表ids来一一管理每一个不同数据表，详情清看源代码

## 3 系统前端-frontend

### 3.1 执行命令

```
yarn dev
```

### 3.2 功能简述

## 4 系统后端 - backend 

### 4.1 执行命令

```
nodemon app.js
```

### 4.2  功能简述

## License

Auction Project is open source software licensed as
[MIT](https://github.com/wushengzhu/auction/blob/main/LICENSE).