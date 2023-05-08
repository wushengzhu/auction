export enum MyBid {
  /**
   * 全部
   */
  Total = 0,

  /**
   * 已获拍
   */
  Bidden = 1,

  /**
   * 未获拍
   */
  NoBid = 2,
}
export const MyBidStatus = [
  { value: MyBid.Total, text: '全部' },
  { value: MyBid.Bidden, text: '已获拍' },
  { value: MyBid.NoBid, text: '未获拍' },
];
