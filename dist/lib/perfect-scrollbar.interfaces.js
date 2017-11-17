/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { InjectionToken } from "@angular/core";
export var /** @type {?} */ PERFECT_SCROLLBAR_CONFIG = new InjectionToken('PERFECT_SCROLLBAR_CONFIG');
var Geometry = (function () {
    function Geometry(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    return Geometry;
}());
export { Geometry };
function Geometry_tsickle_Closure_declarations() {
    /** @type {?} */
    Geometry.prototype.x;
    /** @type {?} */
    Geometry.prototype.y;
    /** @type {?} */
    Geometry.prototype.w;
    /** @type {?} */
    Geometry.prototype.h;
}
var Position = (function () {
    function Position(x, y) {
        this.x = x;
        this.y = y;
    }
    return Position;
}());
export { Position };
function Position_tsickle_Closure_declarations() {
    /** @type {?} */
    Position.prototype.x;
    /** @type {?} */
    Position.prototype.y;
}
/**
 * @record
 */
export function PerfectScrollbarConfigInterface() { }
function PerfectScrollbarConfigInterface_tsickle_Closure_declarations() {
    /** @type {?|undefined} */
    PerfectScrollbarConfigInterface.prototype.handlers;
    /** @type {?|undefined} */
    PerfectScrollbarConfigInterface.prototype.wheelSpeed;
    /** @type {?|undefined} */
    PerfectScrollbarConfigInterface.prototype.swipeEasing;
    /** @type {?|undefined} */
    PerfectScrollbarConfigInterface.prototype.suppressScrollX;
    /** @type {?|undefined} */
    PerfectScrollbarConfigInterface.prototype.suppressScrollY;
    /** @type {?|undefined} */
    PerfectScrollbarConfigInterface.prototype.useBothWheelAxes;
    /** @type {?|undefined} */
    PerfectScrollbarConfigInterface.prototype.wheelPropagation;
    /** @type {?|undefined} */
    PerfectScrollbarConfigInterface.prototype.swipePropagation;
    /** @type {?|undefined} */
    PerfectScrollbarConfigInterface.prototype.scrollingThreshold;
    /** @type {?|undefined} */
    PerfectScrollbarConfigInterface.prototype.minScrollbarLength;
    /** @type {?|undefined} */
    PerfectScrollbarConfigInterface.prototype.maxScrollbarLength;
    /** @type {?|undefined} */
    PerfectScrollbarConfigInterface.prototype.scrollXMarginOffset;
    /** @type {?|undefined} */
    PerfectScrollbarConfigInterface.prototype.scrollYMarginOffset;
}
var PerfectScrollbarConfig = (function () {
    function PerfectScrollbarConfig(config) {
        if (config === void 0) { config = {}; }
        this.assign(config);
    }
    /**
     * @param {?=} config
     * @return {?}
     */
    PerfectScrollbarConfig.prototype.assign = /**
     * @param {?=} config
     * @return {?}
     */
    function (config) {
        if (config === void 0) { config = {}; }
        for (var /** @type {?} */ key in config) {
            this[key] = config[key];
        }
    };
    return PerfectScrollbarConfig;
}());
export { PerfectScrollbarConfig };
function PerfectScrollbarConfig_tsickle_Closure_declarations() {
    /** @type {?} */
    PerfectScrollbarConfig.prototype.handlers;
    /** @type {?} */
    PerfectScrollbarConfig.prototype.wheelSpeed;
    /** @type {?} */
    PerfectScrollbarConfig.prototype.swipeEasing;
    /** @type {?} */
    PerfectScrollbarConfig.prototype.suppressScrollX;
    /** @type {?} */
    PerfectScrollbarConfig.prototype.suppressScrollY;
    /** @type {?} */
    PerfectScrollbarConfig.prototype.useBothWheelAxes;
    /** @type {?} */
    PerfectScrollbarConfig.prototype.wheelPropagation;
    /** @type {?} */
    PerfectScrollbarConfig.prototype.swipePropagation;
    /** @type {?} */
    PerfectScrollbarConfig.prototype.scrollingThreshold;
    /** @type {?} */
    PerfectScrollbarConfig.prototype.minScrollbarLength;
    /** @type {?} */
    PerfectScrollbarConfig.prototype.maxScrollbarLength;
    /** @type {?} */
    PerfectScrollbarConfig.prototype.scrollXMarginOffset;
    /** @type {?} */
    PerfectScrollbarConfig.prototype.scrollYMarginOffset;
}
//# sourceMappingURL=perfect-scrollbar.interfaces.js.map