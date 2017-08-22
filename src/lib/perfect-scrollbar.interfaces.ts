export interface PerfectScrollbarConfigInterface {
  wheelSpeed?: number;
  wheelPropagation?: boolean;
  swipePropagation?: boolean;
  minScrollbarLength?: number;
  maxScrollbarLength?: number;
  useBothWheelAxes?: boolean;
  suppressScrollX?: boolean;
  suppressScrollY?: boolean;
  scrollXMarginOffset?: number;
  scrollYMarginOffset?: number;
  stopPropagationOnClick?: boolean;
}

export class PerfectScrollbarConfig implements PerfectScrollbarConfigInterface {
  public wheelSpeed: number;
  public wheelPropagation: boolean;
  public swipePropagation: boolean;
  public minScrollbarLength: number;
  public maxScrollbarLength: number;
  public useBothWheelAxes: boolean;
  public suppressScrollX: boolean;
  public suppressScrollY: boolean;
  public scrollXMarginOffset: number;
  public scrollYMarginOffset: number;
  public stopPropagationOnClick: boolean;

  constructor(config: PerfectScrollbarConfigInterface = {}) {
    this.assign(config);
  }

  public assign(config: PerfectScrollbarConfigInterface = {}) {
    for (const key in config) {
      this[key] = config[key];
    }
  }
}
