export class EnumOptions {
    /**
     *
     */
    constructor(init?: EnumOptions) {
      if (init) {
        Object.assign(this, init);
      }
    }
    options: Array<any>;
  
    value?: string = 'value';
  
    text?: string = 'text';
  
    enableFormatDisplay?: boolean = true;
  }