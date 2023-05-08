export enum Receive {
  /**
   * 待领取
   */
  Unclaimed = 3,

  /**
   * 已确认收货
   */
  Confirmed = 4,

  /**
   * 已退回
   */
  Returned = 5,

  /**
   * 已付款
   */
  Paid = 6,
}
export const ReceiveStatus = [
  { value: Receive.Unclaimed, text: '待领取' },
  { value: Receive.Confirmed, text: '已确认收货' },
  { value: Receive.Paid, text: '已付款' },
];
