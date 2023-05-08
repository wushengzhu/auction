export enum Notice {
  /**
   * 已撤回
   */
  Recalled = -1,

  /**
   * 草稿
   */
  Drafted = 0,

  /**
   * 已发布
   */
  Published = 1,
}
export const NoticeStatus = [
  // { value: Notice.Recalled, text: '已撤回' },
  // { value: Notice.Drafted, text: '草稿' },
  { value: Notice.Drafted, text: '未发布' },
  { value: Notice.Published, text: '已发布' },
];
