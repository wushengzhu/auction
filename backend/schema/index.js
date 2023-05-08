const mongoose = require("../db/index");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  Id: Number,
  Account: String,
  Password: String,
  UserName: String,
  Gender: {
    type: Boolean,
    default: 0,
  },
  Category: {
    type: Number,
    default: 0, // 默认超级管理员
  },
  Age: Number,
  Email: String,
  Remark: String,
  Image: String,
  Address: String,
  CreateTime: String,
  IsActive: {
    type: Boolean,
    default: true,
  },
  Roles: {
    type: Array,
    default: ["visitor"],
  },
});
const dictSchema = new Schema({
  Id: Number,
  ParentId: Number,
  ModCode: String,
  DictName: String,
  Key: String,
  Value: String,
  CreateTime: String,
});

const idsSchema = new Schema({
  Id: Number,
  Name: String,
});

const errSchema = new Schema({
  Id: Number,
  ErrName: String,
  ErrInfo: String,
  ErrTime: String,
  ErrDate: String,
});

const publishSchema = new Schema({
  Id: Number,
  NoticeId: Number,
  MaterialId: Number,
  SerialNumber: String,
  Excerpt: String,
  Description: String,
  Title: String,
  JDPrice: Number,
  TaoBaoPrice: Number,
  Images: Array,
  OfficialPrice: Number,
  MarkUp: Number,
  StartPrice: Number,
  Material: Object,
  File: Object,
  EvaluationPrice: Number,
  StartTime: String,
  Quantity: Number, // 挂网数量
  EndTime: String,
  RemainTime: String,
  DisplayToNotice: String,
  CreatorId: String,
  Creator: String,
  CreateDate: String,
  Status: Number,
});

const materialSchema = new Schema({
  Id: Number,
  Name: String,
  SerialNumber: String,
  Category: String,
  WarehouseCategory: String,
  ProduceDate: String,
  EffectiveDate: String,
  GuaranteePeriod: String,
  Quantity: Number,
  UserId: String,
  Detail: String,
  Remark: String,
  AllowAuction: Boolean,
  SoldQuantity: String,
  RemainQuantity: String,
  CreateTime: String,
  ImgArr: Array,
  AttachArr: Array,
});

const fileSchema = new Schema({
  Id: Number,
  ObjectId: Number,
  ModCode: String,
  FileHash: String,
  FileName: String,
  OriginName: String,
  FileType: String,
  FileByteLength: String,
  FileSize: String,
  Creator: String,
  CreateTime: String,
});
const materialTypeSchema = new Schema({
  Id: Number,
  Name: String,
  Actived: Boolean,
  ParentId: Number,
  Code: String,
});

const loginRecordSchema = new Schema({
  Id: Number,
  IP: String,
  City: String,
  Addr: String,
  ProVince: String,
  OperateName: String,
  CreateDate: String,
});

const bidSchema = new Schema({
  Id: Number,
  PublishId: Number,
  UserId: Number,
  UserName: String,
  OperateTime: String,
  Amount: Number,
  Status: Number,
  Publish: Object,
});

// 映射到集合上去
const materialTypeModel = mongoose.model(
  "auction_material_type",
  materialTypeSchema
);
const bidModel = mongoose.model("auction_bid_records", bidSchema);
const fileModel = mongoose.model("auction_file", fileSchema);
const materialModel = mongoose.model("auction_materials", materialSchema);
const publichModel = mongoose.model("auction_publishs", publishSchema);
const errModel = mongoose.model("auction_err_logs", errSchema);
const idsModel = mongoose.model("auction_ids", idsSchema);
const dictModel = mongoose.model("auction_dicts", dictSchema);
const userModel = mongoose.model("auction_users", userSchema);
const loginRecordModel = mongoose.model(
  "auction_login_records",
  loginRecordSchema
);

const models = {
  bidModel,
  loginRecordModel,
  userModel,
  dictModel,
  idsModel,
  errModel,
  publichModel,
  materialModel,
  fileModel,
  materialTypeModel,
};
const schemas = {
  bidSchema,
  loginRecordSchema,
  materialTypeSchema,
  fileSchema,
  publishSchema,
  materialSchema,
  errSchema,
  userSchema,
  dictSchema,
  idsSchema,
};

module.exports = { ...models, ...schemas };
