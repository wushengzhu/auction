export enum Bid {
  /**
   * 竞价领先
   */
  Leading = 0,

  /**
   * 无效出价/低于最高出价
   */
  Fail = 1,

  /**
   * 竞价成功
   */
  Success = 2,
}
export const BidStatus = [
  { value: Bid.Leading, text: '竞价领先' },
  { value: Bid.Fail, text: '无效出价' },
  { value: Bid.Success, text: '竞价成功' },
];
