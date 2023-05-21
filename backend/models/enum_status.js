exports.Publish={
  /**
   * 已取消拍卖
   */
  Canceled : -1,
  /**
   * 未发布
   */
  Unpublished : 0,

  /**
   * 已发布
   */
  Published : 1,

  /**
   * 已流拍
   */
  Streamed : 2,

  /**
   * 已售出
   */
  Sold : 3,

  /**
   * 已确认收货/已领取
   */
  Delivered : 4,

  /**
   * 已退回
   */
  Returned : 5,

  /**
   * 已付款/已领取
   */
  Paid : 6,
}

exports.Bid={
  /**
   * 竞价领先
   */
  Leading:0,

  /**
   * 无效出价/低于最高出价
   */
  Fail:1,

  /**
   * 竞价成功
   */
  Success:2,
}