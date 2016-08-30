import { provide, Provider } from '@angular/core';

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
  public wheelSpeed: number = 1;
  public wheelPropagation: boolean = false;
  public swipePropagation: boolean = true;
  public minScrollbarLength: number = null;
  public maxScrollbarLength: number = null;
  public useBothWheelAxes: boolean = false;
  public suppressScrollX: boolean = false;
  public suppressScrollY: boolean = false;
  public scrollXMarginOffset: number = 0;
  public scrollYMarginOffset: number = 0;
  public stopPropagationOnClick: boolean = true;

  constructor(config: PerfectScrollbarConfigInterface = {}) {
    this.assign(config);
  }

  public assign(config: PerfectScrollbarConfigInterface = {}) {
    for (var key in config) {
      this[key] = config[key];
    }
  }
}
