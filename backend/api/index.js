const express = require("express");
// 创建路由对象
const router = express.Router();
const userHandler = require("../api_handler/user/user_handler");
const dictHandler = require("../api_handler/dict_handler");
const materialHandler = require("../api_handler/auction/material_handler");
const publishHandler = require("../api_handler/auction/publish_handler");
const materialCategory = require("../api_handler/material_type_handler");
const loginRecord = require("../api_handler/login_record");
const bidHandler = require("../api_handler/auction/bid_handler");

router.post("/User/Register", userHandler.saveUser); // 用户注册
router.post("/User/Login", userHandler.loginUser); // 用户登录
router.post("/User/Delete", userHandler.deleteUser);
router.post("/User/GetList", userHandler.getUserList);
router.get("/User/GetById", userHandler.getUserById);
router.post("/User/Save", userHandler.saveUser);

router.get("/Material/Delete", materialHandler.delete);
router.post("/Material/GetList", materialHandler.getList);
router.get("/Material/GetById", materialHandler.getById);
router.post("/Material/Save", materialHandler.save);

router.get("/BidRecord/Delete", bidHandler.delete);
router.post("/BidRecord/GetList", bidHandler.getList);
router.get("/BidRecord/GetById", bidHandler.getById);
router.post("/BidRecord/Save", bidHandler.save);

router.get("/Publish/Delete", publishHandler.delete);
router.post("/Publish/GetList", publishHandler.getList);
router.get("/Publish/GetById", publishHandler.getById);
router.post("/Publish/Save", publishHandler.save);
router.post("/Publish/UpdateStatus",publishHandler.updateStatus);

router.get("/Dictionary/Delete", dictHandler.delete);
router.post("/Dictionary/GetList", dictHandler.getList);
router.get("/Dictionary/GetById", dictHandler.getById);
router.post("/Dictionary/Save", dictHandler.save);

router.get("/Category/Delete", materialCategory.delete);
router.post("/Category/GetList", materialCategory.getList);
router.get("/Category/GetById", materialCategory.getById);
router.post("/Category/Save", materialCategory.save);

router.post("/LoginRecord/GetList", loginRecord.getList);
router.post("/LoginRecord/Save", loginRecord.save);

// 将路由对象共享出去
module.exports = router;
