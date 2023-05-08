export class ButtonOptions {
  /**
   *
   */
  constructor(init?: ButtonOptions) {
    if (init) {
      Object.assign(this, init);
    }
  }

  title?: string;
  icon: string;
  tooltipTitle?: string;
  tooltipPosition?: string = 'bottom';
  callBack: (entity) => void;

  visible?: (entity, observer) => void = (_entity, observer) =>
    observer.next(true);
}
