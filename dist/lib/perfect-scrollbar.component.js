/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import "rxjs/add/operator/throttleTime";
import "rxjs/add/operator/distinctUntilChanged";
import { Subject } from "rxjs/Subject";
import { Component, ViewEncapsulation, Input, ViewChild, HostBinding, HostListener, ElementRef, ChangeDetectorRef } from "@angular/core";
import { PerfectScrollbarDirective } from "./perfect-scrollbar.directive";
var PerfectScrollbarComponent = (function () {
    function PerfectScrollbarComponent(cdRef, elementRef) {
        this.cdRef = cdRef;
        this.elementRef = elementRef;
        this.states = {};
        this.notify = null;
        this.userInteraction = false;
        this.allowPropagation = false;
        this.cancelEvent = null;
        this.timeoutState = null;
        this.timeoutScroll = null;
        this.usePropagationX = false;
        this.usePropagationY = false;
        this.statesSub = null;
        this.statesUpdate = new Subject();
        this.activeSub = null;
        this.activeUpdate = new Subject();
        this.disabled = false;
        this.usePSClass = true;
        this.autoPropagation = false;
        this.scrollIndicators = false;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    PerfectScrollbarComponent.prototype.onGeneratedEvent = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        // Stop the generated event from reaching window for PS to work correctly
        if (event['psGenerated']) {
            event.stopPropagation();
        }
    };
    /**
     * @return {?}
     */
    PerfectScrollbarComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.activeSub = this.activeUpdate
            .distinctUntilChanged()
            .subscribe(function (active) {
            _this.allowPropagation = active;
        });
        this.statesSub = this.statesUpdate
            .distinctUntilChanged()
            .subscribe(function (state) {
            window.clearTimeout(_this.timeoutState);
            if (state !== 'x' && state !== 'y') {
                _this.notify = true;
                _this.states[state] = true;
                if (state === 'top') {
                    _this.states.bottom = false;
                }
                else if (state === 'bottom') {
                    _this.states.top = false;
                }
                else if (state === 'left') {
                    _this.states.rights = false;
                }
                else if (state === 'rights') {
                    _this.states.left = false;
                }
                _this.timeoutState = window.setTimeout(function () {
                    _this.notify = false;
                    if (_this.autoPropagation && _this.userInteraction &&
                        ((!_this.usePropagationX && (_this.states.left || _this.states.right)) ||
                            (!_this.usePropagationY && (_this.states.top || _this.states.bottom)))) {
                        _this.allowPropagation = true;
                    }
                    _this.cdRef.markForCheck();
                }, 300);
            }
            else {
                _this.notify = false;
                if (state === 'x') {
                    _this.states.left = false;
                    _this.states.right = false;
                }
                else if (state === 'y') {
                    _this.states.top = false;
                    _this.states.bottom = false;
                }
                _this.userInteraction = true;
                if (_this.autoPropagation &&
                    (!_this.usePropagationX || !_this.usePropagationY)) {
                    _this.allowPropagation = false;
                    if (_this.cancelEvent) {
                        _this.elementRef.nativeElement.dispatchEvent(_this.cancelEvent);
                        _this.cancelEvent = null;
                    }
                }
                else if (_this.scrollIndicators) {
                    _this.notify = true;
                    _this.timeoutState = window.setTimeout(function () {
                        _this.notify = false;
                        _this.cdRef.markForCheck();
                    }, 300);
                }
            }
            _this.cdRef.markForCheck();
            _this.cdRef.detectChanges();
        });
    };
    /**
     * @return {?}
     */
    PerfectScrollbarComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.activeSub) {
            this.activeSub.unsubscribe();
        }
        if (this.statesSub) {
            this.statesSub.unsubscribe();
        }
        if (this.timeoutState) {
            window.clearTimeout(this.timeoutState);
        }
        if (this.timeoutScroll) {
            window.clearTimeout(this.timeoutScroll);
        }
    };
    /**
     * @return {?}
     */
    PerfectScrollbarComponent.prototype.ngDoCheck = /**
     * @return {?}
     */
    function () {
        if (!this.disabled && this.autoPropagation && this.directiveRef) {
            var /** @type {?} */ element = this.directiveRef.elementRef.nativeElement;
            this.usePropagationX = !element.classList.contains('ps--active-x');
            this.usePropagationY = !element.classList.contains('ps--active-y');
            this.activeUpdate.next(this.usePropagationX && this.usePropagationY);
        }
    };
    /**
     * @return {?}
     */
    PerfectScrollbarComponent.prototype.getConfig = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ config = this.config || {};
        if (this.autoPropagation) {
            config.swipePropagation = true;
            config.wheelPropagation = true;
        }
        return config;
    };
    /**
     * @param {?=} event
     * @return {?}
     */
    PerfectScrollbarComponent.prototype.onTouchEnd = /**
     * @param {?=} event
     * @return {?}
     */
    function (event) {
        if (event === void 0) { event = null; }
        if (!this.disabled && this.autoPropagation &&
            (!this.usePropagationX || !this.usePropagationY)) {
            this.cancelEvent = null;
            this.allowPropagation = false;
        }
    };
    /**
     * @param {?=} event
     * @return {?}
     */
    PerfectScrollbarComponent.prototype.onTouchMove = /**
     * @param {?=} event
     * @return {?}
     */
    function (event) {
        if (event === void 0) { event = null; }
        if (!this.disabled && this.autoPropagation && !this.allowPropagation) {
            event.preventDefault();
            event.stopPropagation();
        }
    };
    /**
     * @param {?=} event
     * @return {?}
     */
    PerfectScrollbarComponent.prototype.onTouchStart = /**
     * @param {?=} event
     * @return {?}
     */
    function (event) {
        if (event === void 0) { event = null; }
        if (!this.disabled && this.autoPropagation) {
            this.userInteraction = true;
            if (this.allowPropagation) {
                // PS stops the touchmove event so lets re-emit it here
                if (this.elementRef.nativeElement) {
                    var /** @type {?} */ newEvent = new MouseEvent('touchstart', event);
                    this.cancelEvent = new MouseEvent('touchmove', event);
                    newEvent['psGenerated'] = this.cancelEvent['psGenerated'] = true;
                    newEvent['touches'] = this.cancelEvent['touches'] = event['touches'];
                    newEvent['targetTouches'] = this.cancelEvent['targetTouches'] = event['targetTouches'];
                    this.elementRef.nativeElement.dispatchEvent(newEvent);
                }
            }
            this.cdRef.detectChanges();
        }
    };
    /**
     * @param {?=} event
     * @return {?}
     */
    PerfectScrollbarComponent.prototype.onWheelEvent = /**
     * @param {?=} event
     * @return {?}
     */
    function (event) {
        if (event === void 0) { event = null; }
        if (!this.disabled && this.autoPropagation) {
            this.userInteraction = true;
            if (!this.allowPropagation) {
                event.preventDefault();
                event.stopPropagation();
            }
            else if (!this.usePropagationX || !this.usePropagationY) {
                this.allowPropagation = false;
            }
            this.cdRef.detectChanges();
        }
    };
    /**
     * @param {?=} event
     * @param {?=} state
     * @return {?}
     */
    PerfectScrollbarComponent.prototype.onScrollEvent = /**
     * @param {?=} event
     * @param {?=} state
     * @return {?}
     */
    function (event, state) {
        if (event === void 0) { event = null; }
        if (!this.disabled && (this.autoPropagation || this.scrollIndicators) &&
            (!event || event.currentTarget === event.target)) {
            this.statesUpdate.next(state);
        }
    };
    PerfectScrollbarComponent.decorators = [
        { type: Component, args: [{
                    selector: 'perfect-scrollbar',
                    template: '<div style="position: static" [class.ps]="usePSClass" [perfectScrollbar]="getConfig()" [disabled]="disabled" (wheel)="onWheelEvent($event)" (touchstart)="onTouchStart($event)" (touchmove)="onTouchMove($event)" (touchend)="onTouchEnd($event)" (ps-scroll-x)="onScrollEvent($event, \'x\')" (ps-scroll-y)="onScrollEvent($event, \'y\')" (ps-x-reach-end)="onScrollEvent($event, \'right\')" (ps-y-reach-end)="onScrollEvent($event, \'bottom\')" (ps-x-reach-start)="onScrollEvent($event, \'left\')" (ps-y-reach-start)="onScrollEvent($event, \'top\')"><div class="ps-content"><ng-content></ng-content></div><div *ngIf="autoPropagation || scrollIndicators" class="ps-overlay" [class.ps-at-top]="states.top" [class.ps-at-left]="states.left" [class.ps-at-right]="states.right" [class.ps-at-bottom]="states.bottom"><div class="ps-indicator-top" [class.ps-notify]="notify && userInteraction"></div><div class="ps-indicator-left" [class.ps-notify]="notify && userInteraction"></div><div class="ps-indicator-right" [class.ps-notify]="notify && userInteraction"></div><div class="ps-indicator-bottom" [class.ps-notify]="notify && userInteraction"></div></div></div>',
                    styles: ['.ps{overflow:hidden!important;overflow-anchor:none;-ms-overflow-style:none;touch-action:auto;-ms-touch-action:auto}.ps__rail-x{display:none;opacity:0;transition:background-color .2s linear,opacity .2s linear;-webkit-transition:background-color .2s linear,opacity .2s linear;height:15px;bottom:0;position:absolute}.ps__rail-y{display:none;opacity:0;transition:background-color .2s linear,opacity .2s linear;-webkit-transition:background-color .2s linear,opacity .2s linear;width:15px;right:0;position:absolute}.ps--active-x>.ps__rail-x,.ps--active-y>.ps__rail-y{display:block;background-color:transparent}.ps--focus>.ps__rail-x,.ps--focus>.ps__rail-y,.ps--scrolling-x>.ps__rail-x,.ps--scrolling-y>.ps__rail-y,.ps:hover>.ps__rail-x,.ps:hover>.ps__rail-y{opacity:.6}.ps__rail-x:focus,.ps__rail-x:hover,.ps__rail-y:focus,.ps__rail-y:hover{background-color:#eee;opacity:.9}.ps__thumb-x{background-color:#aaa;border-radius:6px;transition:background-color .2s linear,height .2s ease-in-out;-webkit-transition:background-color .2s linear,height .2s ease-in-out;height:6px;bottom:2px;position:absolute}.ps__thumb-y{background-color:#aaa;border-radius:6px;transition:background-color .2s linear,width .2s ease-in-out;-webkit-transition:background-color .2s linear,width .2s ease-in-out;width:6px;right:2px;position:absolute}.ps__rail-x:focus>.ps__thumb-x,.ps__rail-x:hover>.ps__thumb-x{background-color:#999;height:11px}.ps__rail-y:focus>.ps__thumb-y,.ps__rail-y:hover>.ps__thumb-y{background-color:#999;width:11px}@supports (-ms-overflow-style:none){.ps{overflow:auto!important}}@media screen and (-ms-high-contrast:active),(-ms-high-contrast:none){.ps{overflow:auto!important}}perfect-scrollbar{position:relative;display:block;width:100%;height:100%;max-width:100%;max-height:100%}perfect-scrollbar[hidden]{display:none}perfect-scrollbar[fxflex]{display:flex;flex-direction:column;-webkit-box-orient:column;-webkit-box-direction:column;height:auto;min-width:0;min-height:0}perfect-scrollbar[fxflex]>.ps{flex:1 1 auto;-ms-flex:1 1 auto;-webkit-box-flex:1;width:auto;height:auto;min-width:0;min-height:0}perfect-scrollbar[fxlayout]{display:flex;flex-direction:inherit;-webkit-box-orient:inherit;-webkit-box-direction:inherit;align-item:inherit;place-content:inherit;-webkit-box-pack:inherit;-webkit-box-align:inherit}perfect-scrollbar[fxlayout]>.ps,perfect-scrollbar[fxlayout]>.ps>.ps-content{display:flex;flex-direction:inherit!important;-webkit-box-orient:inherit!important;-webkit-box-direction:inherit!important;align-item:inherit;place-content:inherit;-webkit-box-pack:inherit;-webkit-box-align:inherit}perfect-scrollbar>.ps{position:static;display:block;width:inherit;height:inherit;max-width:inherit;max-height:inherit}perfect-scrollbar>.ps>.ps-overlay{position:absolute;top:0;right:0;bottom:0;left:0;display:block;overflow:hidden;pointer-events:none}perfect-scrollbar>.ps>.ps-overlay .ps-indicator-bottom,perfect-scrollbar>.ps>.ps-overlay .ps-indicator-left,perfect-scrollbar>.ps>.ps-overlay .ps-indicator-right,perfect-scrollbar>.ps>.ps-overlay .ps-indicator-top{position:absolute;opacity:0;transition:opacity .3s ease-in-out}perfect-scrollbar>.ps>.ps-overlay .ps-indicator-bottom,perfect-scrollbar>.ps>.ps-overlay .ps-indicator-top{left:0;min-width:100%;min-height:24px}perfect-scrollbar>.ps>.ps-overlay .ps-indicator-left,perfect-scrollbar>.ps>.ps-overlay .ps-indicator-right{top:0;min-width:24px;min-height:100%}perfect-scrollbar>.ps>.ps-overlay .ps-indicator-top{top:0}perfect-scrollbar>.ps>.ps-overlay .ps-indicator-left{left:0}perfect-scrollbar>.ps>.ps-overlay .ps-indicator-right{right:0}perfect-scrollbar>.ps>.ps-overlay .ps-indicator-bottom{bottom:0}perfect-scrollbar>.ps.ps--active-y>.ps__rail-y{top:0!important;right:0!important;width:10px;transition:width .2s linear,opacity .2s linear,background-color .2s linear}perfect-scrollbar>.ps.ps--active-y>.ps__rail-y:hover{width:15px}perfect-scrollbar>.ps.ps--active-x>.ps__rail-x{bottom:0!important;left:0!important;height:10px;transition:height .2s linear,opacity .2s linear,background-color .2s linear}perfect-scrollbar>.ps.ps--active-x>.ps__rail-x:hover{height:15px}perfect-scrollbar>.ps.ps--active-x.ps--active-y>.ps__rail-y{margin:0 0 10px}perfect-scrollbar>.ps.ps--active-x.ps--active-y>.ps__rail-x{margin:0 10px 0 0}perfect-scrollbar>.ps.ps--scrolling-y>.ps__rail-y{opacity:.9;background-color:#eee}perfect-scrollbar>.ps.ps--scrolling-x>.ps__rail-x{opacity:.9;background-color:#eee}perfect-scrollbar.ps-show-always>.ps.ps--active-y>.ps__rail-y{opacity:.6}perfect-scrollbar.ps-show-always>.ps.ps--active-x>.ps__rail-x{opacity:.6}perfect-scrollbar.ps-show-active>.ps.ps--active-y>.ps-overlay:not(.ps-at-top) .ps-indicator-top{opacity:1;background:linear-gradient(to bottom,rgba(255,255,255,.5) 0,rgba(255,255,255,0) 100%)}perfect-scrollbar.ps-show-active>.ps.ps--active-y>.ps-overlay:not(.ps-at-bottom) .ps-indicator-bottom{opacity:1;background:linear-gradient(to top,rgba(255,255,255,.5) 0,rgba(255,255,255,0) 100%)}perfect-scrollbar.ps-show-active>.ps.ps--active-x>.ps-overlay:not(.ps-at-left) .ps-indicator-left{opacity:1;background:linear-gradient(to right,rgba(255,255,255,.5) 0,rgba(255,255,255,0) 100%)}perfect-scrollbar.ps-show-active>.ps.ps--active-x>.ps-overlay:not(.ps-at-right) .ps-indicator-right{opacity:1;background:linear-gradient(to left,rgba(255,255,255,.5) 0,rgba(255,255,255,0) 100%)}perfect-scrollbar.ps-show-active.ps-show-limits>.ps.ps--active-y>.ps-overlay.ps-at-top .ps-indicator-top{background:linear-gradient(to bottom,rgba(170,170,170,.5) 0,rgba(170,170,170,0) 100%)}perfect-scrollbar.ps-show-active.ps-show-limits>.ps.ps--active-y>.ps-overlay.ps-at-top .ps-indicator-top.ps-notify{opacity:1}perfect-scrollbar.ps-show-active.ps-show-limits>.ps.ps--active-y>.ps-overlay.ps-at-bottom .ps-indicator-bottom{background:linear-gradient(to top,rgba(170,170,170,.5) 0,rgba(170,170,170,0) 100%)}perfect-scrollbar.ps-show-active.ps-show-limits>.ps.ps--active-y>.ps-overlay.ps-at-bottom .ps-indicator-bottom.ps-notify{opacity:1}perfect-scrollbar.ps-show-active.ps-show-limits>.ps.ps--active-x>.ps-overlay.ps-at-left .ps-indicator-left{background:linear-gradient(to right,rgba(170,170,170,.5) 0,rgba(170,170,170,0) 100%)}perfect-scrollbar.ps-show-active.ps-show-limits>.ps.ps--active-x>.ps-overlay.ps-at-left .ps-indicator-left.ps-notify{opacity:1}perfect-scrollbar.ps-show-active.ps-show-limits>.ps.ps--active-x>.ps-overlay.ps-at-right .ps-indicator-right{background:linear-gradient(to left,rgba(170,170,170,.5) 0,rgba(170,170,170,0) 100%)}perfect-scrollbar.ps-show-active.ps-show-limits>.ps.ps--active-x>.ps-overlay.ps-at-right .ps-indicator-right.ps-notify{opacity:1}'],
                    encapsulation: ViewEncapsulation.None
                },] },
    ];
    /** @nocollapse */
    PerfectScrollbarComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef, },
        { type: ElementRef, },
    ]; };
    PerfectScrollbarComponent.propDecorators = {
        "disabled": [{ type: Input },],
        "usePSClass": [{ type: Input },],
        "autoPropagation": [{ type: HostBinding, args: ['class.ps-show-limits',] }, { type: Input },],
        "scrollIndicators": [{ type: HostBinding, args: ['class.ps-show-active',] }, { type: Input },],
        "config": [{ type: Input },],
        "directiveRef": [{ type: ViewChild, args: [PerfectScrollbarDirective,] },],
        "onGeneratedEvent": [{ type: HostListener, args: ['document:touchstart', ['$event'],] },],
    };
    return PerfectScrollbarComponent;
}());
export { PerfectScrollbarComponent };
function PerfectScrollbarComponent_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    PerfectScrollbarComponent.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    PerfectScrollbarComponent.ctorParameters;
    /** @type {!Object<string,!Array<{type: !Function, args: (undefined|!Array<?>)}>>} */
    PerfectScrollbarComponent.propDecorators;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.states;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.notify;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.userInteraction;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.allowPropagation;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.cancelEvent;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.timeoutState;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.timeoutScroll;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.usePropagationX;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.usePropagationY;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.statesSub;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.statesUpdate;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.activeSub;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.activeUpdate;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.disabled;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.usePSClass;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.autoPropagation;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.scrollIndicators;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.config;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.directiveRef;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.cdRef;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.elementRef;
}
//# sourceMappingURL=perfect-scrollbar.component.js.map