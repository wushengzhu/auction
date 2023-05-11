const mongoose = require('../db/index');
const Schema = mongoose.Schema;

/**
 * 数据表名称
 */
const DataTable = {
  material:'auction_materials',
  publish:'auction_publishs',
  file:'auction_files',
  ids:'auction_ids',
  dict:'auction_dicts',
  user:'auction_users',
  logs:'auction_err_logs',
  bid:'auction_bid_records',
  login:'auction_login_records',
  receive:'auction_receive_records',
  return:'auction_return_records',
  materialType:'auction_material_type',
}

/**
 * 用户表模型
 */
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
    default: ['visitor'],
  },
});

/**
 * 字典模型
 */
const dictSchema = new Schema({
  Id: Number,
  ParentId: Number,
  ModCode: String,
  DictName: String,
  Key: String,
  Value: String,
  CreateTime: String,
});

/**
 * 自定义索引模型
 */
const idsSchema = new Schema({
  Id: Number,
  Name: String,
});

/**
 * 错误模型
 */
const errSchema = new Schema({
  Id: Number,
  ErrName: String,
  ErrInfo: String,
  ErrTime: String,
  ErrDate: String,
});

/**
 * 发布模型
 * 这是一个嵌套表
 * 当你定义嵌套表的 schema 时，需要将主表的 ObjectId 存储在其中一个字段中
 */
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
  Material: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: DataTable.material // 指定关联的数据表为 'auction_materials'
  }],
  ReceiveRecord:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: DataTable.receive // 指定关联的数据表为 'auction_receive_records'
  }],
  BidRecord:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: DataTable.bid // 指定关联的数据表为 'auction_bid_records'
  }],
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

/**
 * 物资模型
 */
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

/**
 * 文件模型
 */
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

/**
 * 物资种类模型
 */
const materialTypeSchema = new Schema({
  Id: Number,
  Name: String,
  Actived: Boolean,
  ParentId: Number,
  Code: String,
});

/**
 * 登录记录模型
 */
const loginRecordSchema = new Schema({
  Id: Number,
  IP: String,
  City: String,
  Addr: String,
  ProVince: String,
  OperateName: String,
  CreateDate: String,
});

/**
 * 竞价模型
 */
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

/**
 * 收货模型
 */
const receiveSchema = new Schema({
  Id: Number,
  PublishId: String,
  UserId: Number,
  UserName: String,
  OperatorId: String,
  Operator: String,
  OperateTime: String,
  Remark: String,
  PayType: String,
});

/**
 * 返回模型
 */
const returnSchema = new Schema({
  Id: Number,
  PublishId: String,
  UserId: Number,
  UserName: String,
  OperatorId: String,
  Operator: String,
  OperateTime: String,
  Reason: String,
  PaymentMethod: String,
});

// 映射到集合上去
const materialTypeModel = mongoose.model(
  DataTable.materialType,
  materialTypeSchema
);
const bidModel = mongoose.model(DataTable.bid, bidSchema);
const fileModel = mongoose.model(DataTable.file, fileSchema);
const materialModel = mongoose.model(DataTable.material, materialSchema);
const publishModel = mongoose.model(DataTable.publish, publishSchema);
const errModel = mongoose.model(DataTable.logs, errSchema);
const idsModel = mongoose.model(DataTable.ids, idsSchema);
const dictModel = mongoose.model(DataTable.dict, dictSchema);
const userModel = mongoose.model(DataTable.user, userSchema);
const receiveModel = mongoose.model(DataTable.receive, receiveSchema);
const returnModel = mongoose.model(DataTable.return, returnSchema);
const loginRecordModel = mongoose.model(
  DataTable.login,
  loginRecordSchema
);

const models = {
  returnModel,
  receiveModel,
  bidModel,
  loginRecordModel,
  userModel,
  dictModel,
  idsModel,
  errModel,
  publishModel,
  materialModel,
  fileModel,
  materialTypeModel,
};
const schemas = {
  returnSchema,
  receiveSchema,
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

module.exports = { ...models, ...schemas,DataTable };
