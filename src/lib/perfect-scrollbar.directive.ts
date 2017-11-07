import PerfectScrollbar from 'perfect-scrollbar';

import ResizeObserver from 'resize-observer-polyfill';

import { SimpleChanges, KeyValueDiffers } from '@angular/core';
import { NgZone, Directive, Optional, ElementRef } from '@angular/core';
import { OnDestroy, DoCheck, OnChanges, AfterViewInit } from '@angular/core';
import { Input, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';

import { Geometry, Position } from './perfect-scrollbar.interfaces';

import { PerfectScrollbarConfig, PerfectScrollbarConfigInterface } from './perfect-scrollbar.interfaces';

@Directive({
  selector: '[perfect-scrollbar], [perfectScrollbar]',
  exportAs: 'ngxPerfectScrollbar'
})
export class PerfectScrollbarDirective implements OnDestroy, DoCheck, OnChanges, AfterViewInit {
  private ps: any;
  private ro: any;

  private timeout: number;

  private configDiff: any;

  @Input() fxShow: boolean = true;
  @Input() fxHide: boolean = false;

  @Input() hidden: boolean = false;

  @Input() disabled: boolean = false;

  @HostBinding('class.ps')
  @Input() usePSClass: boolean = true;

  @HostBinding('style.position')
  @Input() psPosStyle: string = 'relative';

  @Input() runInsideAngular: boolean = false;

  @Input('perfectScrollbar') config: PerfectScrollbarConfigInterface;

  @Input('perfect-scrollbar')
  set oldConfig(config: PerfectScrollbarConfigInterface) {
    console.warn('Deprecated use of perfect-scrollbar selector, use perfectScrollbar instead!');

    this.config = config;
  }

  @Output('ps-x-reach-end') reachEndX = new EventEmitter<any>();
  @Output('ps-y-reach-end') reachEndY = new EventEmitter<any>();

  @Output('ps-x-reach-start') reachStartX = new EventEmitter<any>();
  @Output('ps-y-reach-start') reachStartY = new EventEmitter<any>();

  constructor(@Optional() private defaults: PerfectScrollbarConfig, private zone: NgZone,
    public elementRef: ElementRef, private differs: KeyValueDiffers) {}

  ngOnDestroy() {
    if (this.ro) {
      this.ro.disconnect();
    }

    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }

    if (this.runInsideAngular) {
      this.ps.destroy();
    } else {
      this.zone.runOutsideAngular(() => {
        this.ps.destroy();
      });
    }

    this.ps = null;
  }

  ngDoCheck() {
    if (!this.disabled && this.configDiff) {
      const changes = this.configDiff.diff(this.config || {});

      if (changes) {
        this.ngOnDestroy();

        // Timeout is needed for the styles to update properly
        window.setTimeout(() => {
          this.ngAfterViewInit();
        }, 0);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fxHide']) {
      changes['hidden'] = changes['fxHide'];
    } else if (changes['fxShow']) {
      changes['hidden'] = changes['fxShow'];

      changes['hidden'].currentValue = !changes['fxShow'].currentValue;
      changes['hidden'].previousValue = !changes['fxShow'].previousValue;
    }

    if (changes['disabled'] && !changes['disabled'].isFirstChange()) {
      if (changes['disabled'].currentValue !== changes['disabled'].previousValue) {
        if (changes['disabled'].currentValue === true) {
         this.ngOnDestroy();
        } else if (changes['disabled'].currentValue === false) {
          this.ngAfterViewInit();
        }
      }
    } else if (changes['hidden'] && !changes['hidden'].isFirstChange()) {
      if (changes['hidden'].currentValue !== changes['hidden'].previousValue) {
        if (changes['hidden'].currentValue === false) {
          this.update();
        }
      }
    }
  }

  ngAfterViewInit() {
    if (!this.disabled) {
      const config = new PerfectScrollbarConfig(this.defaults);

      config.assign(this.config);

      if (this.runInsideAngular) {
        this.ps = new PerfectScrollbar(this.elementRef.nativeElement, config);
      } else {
        this.zone.runOutsideAngular(() => {
          this.ps = new PerfectScrollbar(this.elementRef.nativeElement, config);
        });
      }

      if (!this.configDiff) {
        this.configDiff = this.differs.find(this.config || {}).create(null);
      }

      this.zone.runOutsideAngular(() => {
        this.ro = new ResizeObserver((entries, observer) => {
          this.update();
        });

        this.ro.observe(this.elementRef.nativeElement);
      });
    }
  }

  update() {
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }

    this.timeout = window.setTimeout(() => {
      if (!this.disabled && this.configDiff) {
        try {
          if (this.runInsideAngular) {
            this.ps.update();
          } else {
            this.zone.runOutsideAngular(() => {
              this.ps.update();
            });
          }
        } catch (error) {
          // Update can be finished after destroy so catch errors
        }
      }
    }, 0);
  }

  geometry(prefix: string = 'scroll'): Geometry {
    return new Geometry(
      this.elementRef.nativeElement[prefix + 'Left'],
      this.elementRef.nativeElement[prefix + 'Top'],
      this.elementRef.nativeElement[prefix + 'Width'],
      this.elementRef.nativeElement[prefix + 'Height']
    );
  }

  position(absolute: boolean = false): Position {
    if (!absolute) {
      return new Position(
        this.ps.reach.x,
        this.ps.reach.y
      );
    } else {
      return new Position(
        this.elementRef.nativeElement.scrollLeft,
        this.elementRef.nativeElement.scrollTop
      );
    }
  }

  scrollable(direction: string = 'any'): boolean {
    const element = this.elementRef.nativeElement;

    if (direction === 'any') {
      return element.classList.contains('ps--active-x') ||
        element.classList.contains('ps--active-y');
    } else if (direction === 'both') {
      return element.classList.contains('ps--active-x') &&
        element.classList.contains('ps--active-y');
    } else {
      return element.classList.contains('ps--active-' + direction);
    }
  }

  scrollTo(x: number, y?: number, speed?: number, emit?: boolean) {
    if (!this.disabled) {
      if (y == null && speed == null) {
        console.warn('Deprecated use of scrollTo, use the scrollToY function instead!');

        this.animateScrolling('scrollTop', x, speed, emit);
      } else {
        if (x != null) {
          this.animateScrolling('scrollLeft', x, speed, emit);
        }

        if (y != null) {
          this.animateScrolling('scrollTop', y, speed, emit);
        }
      }
    }
  }

  scrollToX(x: number, speed?: number, emit?: boolean) {
    this.animateScrolling('scrollLeft', x, speed, emit);
  }

  scrollToY(y: number, speed?: number, emit?: boolean) {
    this.animateScrolling('scrollTop', y, speed, emit);
  }

  scrollToTop(offset?: number, speed?: number, emit?: boolean) {
    this.animateScrolling('scrollTop', (offset || 0), speed, emit);
  }

  scrollToLeft(offset?: number, speed?: number, emit?: boolean) {
    this.animateScrolling('scrollLeft', (offset || 0), speed, emit);
  }

  scrollToRight(offset?: number, speed?: number, emit?: boolean) {
    const left = this.elementRef.nativeElement.scrollWidth -
      this.elementRef.nativeElement.clientWidth;

    this.animateScrolling('scrollLeft', left - (offset || 0), speed, emit);
  }

  scrollToBottom(offset?: number, speed?: number, emit?: boolean) {
    const top = this.elementRef.nativeElement.scrollHeight -
      this.elementRef.nativeElement.clientHeight;

    this.animateScrolling('scrollTop', top - (offset || 0), speed, emit);
  }

  animateScrolling(target: string, value: number, speed?: number, emit?: boolean) {
    emit = (emit == null) ? true : emit;

    if (!speed) {
      const oldValue = this.elementRef.nativeElement[target];

      this.elementRef.nativeElement[target] = value;

      if (emit && value !== oldValue) {
        this.ps.update(true, true);

        /*const position = this.position();
console.log(position);
        if (target === 'scrollTop' && position.y === 'end') {
          this.reachEndY.emit();
        } else if (target === 'scrollTop' && position.y === 'start') {
        this.reachStartY.emit();
        } else if (target === 'scrollLeft' && position.x === 'end') {
          this.reachEndX.emit();
        } else if (target === 'scrollLeft' &&  position.x === 'start') {
          this.reachStartX.emit();
        }*/
      }
    } else if (value !== this.elementRef.nativeElement[target]) {
      let newValue = 0;
      let scrollCount = 0;

      let oldTimestamp = performance.now();
      let oldValue = this.elementRef.nativeElement[target];

      const cosParameter = (oldValue - value) / 2;

      const step = (newTimestamp) => {
        scrollCount += Math.PI / (speed / (newTimestamp - oldTimestamp));

        newValue = Math.round(value + cosParameter + cosParameter * Math.cos(scrollCount));

        // Only continue animation if scroll position has not changed
        if (this.elementRef.nativeElement[target] === oldValue) {
          if (scrollCount >= Math.PI) {
            this.animateScrolling(target, value, 0, emit);
          } else {
            this.elementRef.nativeElement[target] = oldValue = newValue;

            this.ps.update();

            oldTimestamp = newTimestamp;

            window.requestAnimationFrame(step);
          }
        }
      };

      window.requestAnimationFrame(step);
    }
  }
}
