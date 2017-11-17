import { InjectionToken } from '@angular/core';
export declare const PERFECT_SCROLLBAR_CONFIG: InjectionToken<{}>;
export declare class Geometry {
    x: number;
    y: number;
    w: number;
    h: number;
    constructor(x: number, y: number, w: number, h: number);
}
export declare class Position {
    x: number | 'start' | 'end';
    y: number | 'start' | 'end';
    constructor(x: number | 'start' | 'end', y: number | 'start' | 'end');
}
export interface PerfectScrollbarConfigInterface {
    handlers?: string[];
    wheelSpeed?: number;
    swipeEasing?: boolean;
    suppressScrollX?: boolean;
    suppressScrollY?: boolean;
    useBothWheelAxes?: boolean;
    wheelPropagation?: boolean;
    swipePropagation?: boolean;
    scrollingThreshold?: number;
    minScrollbarLength?: number;
    maxScrollbarLength?: number;
    scrollXMarginOffset?: number;
    scrollYMarginOffset?: number;
}
export declare class PerfectScrollbarConfig implements PerfectScrollbarConfigInterface {
    handlers: string[];
    wheelSpeed: number;
    swipeEasing: boolean;
    suppressScrollX: boolean;
    suppressScrollY: boolean;
    useBothWheelAxes: boolean;
    wheelPropagation: boolean;
    swipePropagation: boolean;
    scrollingThreshold: number;
    minScrollbarLength: number;
    maxScrollbarLength: number;
    scrollXMarginOffset: number;
    scrollYMarginOffset: number;
    constructor(config?: PerfectScrollbarConfigInterface);
    assign(config?: PerfectScrollbarConfigInterface): void;
}
