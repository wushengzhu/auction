// 加上static继承表示该方法不会被实例继承，而是直接通过类来调用
export const Utill = {
  /**
   * 判断是否为undfined、null
   * @param value
   * @returns
   */
  isUndefinedOrNull(value: any): boolean {
    return value === null || value === undefined || value === '';
  },
  /**
   * 判断是否为undefined、null或仅有空白字符
   */
  isUndefinedOrNullOrWhiteSpace(value: string | undefined | null): boolean {
    const whiteSpace = value.replace(/\s/g, '');
    return value === null || value === undefined || whiteSpace === '';
  },
  /**
   * 判断是否为0或空白字符等
   */
  isZeroOrWhiteSpace(value: string | number): boolean {
    const whiteSpace = value.toString().replace(/\s/g, '');
    return value === 0 || whiteSpace === '';
  },
  /**
   * 判断是否为整数
   * @param value
   */
  isInt(value: any): boolean {
    return typeof value === 'number' && value % 1 === 0;
  },
};
