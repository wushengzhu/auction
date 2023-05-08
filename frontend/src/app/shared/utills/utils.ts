export class Util {
  /**
   * 判断是否为undfined、null
   * @param value
   * @returns
   */
  static isUndefinedOrNull(value: any): boolean {
    return typeof value === 'undefined' || value === null;
  }
  /**
   * 判断是否为undefined、null或仅有空白字符
   */
  static isUndefinedOrNullOrWhiteSpace(value: string | undefined | null): boolean {
    return typeof value === 'undefined' || value === null || /^\s*$/.test(value);
  }
  /**
   * 判断是否为0或空白字符等
   */
  static isZeroOrWhiteSpace(value: string | number): boolean {
    if (typeof value === 'undefined' || value === null) {
      return true;
    } else if (typeof value === 'string') {
      return /^\s*$/.test(value) || value === '0';
    } else if (typeof value === 'number') {
      return value === 0;
    } else {
      return false;
    }
  }
  /**
   * 判断是否为整数
   * @param value
   */
  static isInt(value: any): boolean {
    return typeof value === 'number' && value % 1 === 0;
  }

  /**
   * 判断数组是否为Null或者空
   */
  static IsNullOrEmpty<T>(array: T[]) {
    if (!Util.isUndefinedOrNull(array)) {
      if (array instanceof Array) {
        if (array.length > 0) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * 从data中获取field的值
   */
  static getter(data: any, field: string): any {
    if (!(data instanceof Object) || typeof field === 'undefined') {
      return null;
    }
    const fieldTemp = field.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');
    const pathArray = fieldTemp.split(/\./);
    let value = data;
    for (let i = 0, n = pathArray.length; i < n; ++i) {
      const key = pathArray[i];
      if (typeof value === 'object' && key in value) {
        if (value[key] !== null) {
          value = value[key];
        } else {
          return null;
        }
      } else {
        if (i > 0 && typeof value === 'string') {
          value = JSON.parse(value);
          if (typeof value === 'object' && key in value) {
            if (value[key] !== null) {
              value = value[key];
            } else {
              return null;
            }
          } else {
            return null;
          }
        } else {
          return null;
        }
      }
    }
    return value;
  }

  static isFloat(obj: any): boolean {
    return obj === Number(obj) && obj % 1 !== 0;
  }

  static isFunction(value: any) {
    return typeof value === 'function';
  }
}
