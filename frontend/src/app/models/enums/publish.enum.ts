export enum Publish {
  /**
   * 已取消拍卖
   */
  Canceled = -1,
  /**
   * 未发布
   */
  Unpublished = 0,

  /**
   * 已发布
   */
  Published = 1,

  /**
   * 已流拍
   */
  Streamed = 2,

  /**
   * 已售出
   */
  Sold = 3,

  /**
   * 已确认收货/已领取
   */
  Delivered = 4,

  /**
   * 已退回
   */
  Returned = 5,

  /**
   * 已付款/已领取
   */
  Paid = 6,
}
export const PublishStatus = [
  // { value: Publish.Canceled, text: '已取消拍卖' },
  { value: Publish.Unpublished, text: '未发布' },
  { value: Publish.Published, text: '已发布' },
  { value: Publish.Streamed, text: '已流拍' },
  { value: Publish.Sold, text: '已售出' },
  { value: Publish.Delivered, text: '已领取' },
  { value: Publish.Returned, text: '已退回' },
];
