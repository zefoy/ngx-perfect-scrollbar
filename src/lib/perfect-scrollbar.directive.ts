import * as Ps from 'perfect-scrollbar';

import ResizeObserver from 'resize-observer-polyfill';

import { NgZone, Directive, Optional, OnDestroy, DoCheck, OnChanges, AfterViewInit,
  SimpleChanges, KeyValueDiffers, Input, HostBinding, HostListener, ElementRef } from '@angular/core';

import { PerfectScrollbarConfig, PerfectScrollbarConfigInterface } from './perfect-scrollbar.interfaces';

import { Geometry } from './perfect-scrollbar.classes';

@Directive({
  selector: '[perfectScrollbar]',
  exportAs: 'ngxPerfectScrollbar'
})
export class PerfectScrollbarDirective implements OnDestroy, DoCheck, OnChanges, AfterViewInit {
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

  @Input('perfectScrollbar') config: PerfectScrollbarConfigInterface;

  constructor(@Optional() private defaults: PerfectScrollbarConfig, private zone: NgZone,
    public elementRef: ElementRef, private differs: KeyValueDiffers) {}

  ngOnDestroy() {
    if (this.ro) {
      this.ro.disconnect();
    }

    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }

    this.zone.runOutsideAngular(() => {
      Ps.destroy(this.elementRef.nativeElement);
    });
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

      this.zone.runOutsideAngular(() => {
        Ps.initialize(this.elementRef.nativeElement, config);
      });

      if (!this.configDiff) {
        this.configDiff = this.differs.find(this.config || {}).create();
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
          this.zone.runOutsideAngular(() => {
            Ps.update(this.elementRef.nativeElement);
          });
        } catch (error) {
          // Update can be finished after destroy so catch errors
        }
      }
    }, 0);
  }

  geometry(property: string = 'scroll'): Geometry {
    return {
      x: this.elementRef.nativeElement[property + 'Left'],
      y: this.elementRef.nativeElement[property + 'Top'],
      w: this.elementRef.nativeElement[property + 'Width'],
      h: this.elementRef.nativeElement[property + 'Height']
    };
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

  scrollTo(x: number, y?: number, speed?: number) {
    if (!this.disabled) {
      if (y == null && speed == null) {
        this.animateScrolling('scrollTop', x, speed);
      } else {
        if (x != null) {
          this.animateScrolling('scrollLeft', x, speed);
        }

        if (y != null) {
          this.animateScrolling('scrollTop', y, speed);
        }
      }
    }
  }

  scrollToX(x: number, speed?: number) {
    this.animateScrolling('scrollLeft', x, speed);
  }

  scrollToY(y: number, speed?: number) {
    this.animateScrolling('scrollTop', y, speed);
  }

  scrollToTop(offset?: number, speed?: number) {
    this.animateScrolling('scrollTop', (offset || 0), speed);
  }

  scrollToLeft(offset?: number, speed?: number) {
    this.animateScrolling('scrollLeft', (offset || 0), speed);
  }

  scrollToRight(offset?: number, speed?: number) {
    const width = this.elementRef.nativeElement.scrollWidth;

    this.animateScrolling('scrollLeft', width - (offset || 0), speed);
  }

  scrollToBottom(offset?: number, speed?: number) {
    const height = this.elementRef.nativeElement.scrollHeight;

    this.animateScrolling('scrollTop', height - (offset || 0), speed);
  }

  animateScrolling(target: string, value: number, speed?: number) {
    if (!speed) {
      this.elementRef.nativeElement[target] = value;

      this.update();

      // PS has weird event sending order, this is a workaround for that
      this.timeout = null; this.update();
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
            this.elementRef.nativeElement[target] = value;

            this.update();

            // PS has weird event sending order, this is a workaround for that
            this.timeout = null; this.update();
          } else {
            this.elementRef.nativeElement[target] = oldValue = newValue;

            oldTimestamp = newTimestamp;

            window.requestAnimationFrame(step);
          }
        }
      };

      window.requestAnimationFrame(step);
    }
  }
}
