import PerfectScrollbar from 'perfect-scrollbar';

import ResizeObserver from 'resize-observer-polyfill';

import { Directive,
  OnInit, DoCheck, OnChanges, OnDestroy,
  Input, NgZone, ElementRef, Optional, Inject,
  SimpleChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';

import { Geometry, Position } from './perfect-scrollbar.interfaces';

import { PERFECT_SCROLLBAR_CONFIG } from './perfect-scrollbar.interfaces';

import { PerfectScrollbarConfig, PerfectScrollbarConfigInterface } from './perfect-scrollbar.interfaces';

@Directive({
  selector: '[perfectScrollbar]',
  exportAs: 'ngxPerfectScrollbar'
})
export class PerfectScrollbarDirective implements OnInit, OnDestroy, DoCheck, OnChanges {
  private ro: any;

  private instance: any;

  private timeout: number;

  private configDiff: KeyValueDiffer<string, any>;

  @Input() disabled: boolean = false;

  @Input('perfectScrollbar') config: PerfectScrollbarConfigInterface;

  constructor(private zone: NgZone, public elementRef: ElementRef, private differs: KeyValueDiffers,
    @Optional() @Inject(PERFECT_SCROLLBAR_CONFIG) private defaults: PerfectScrollbarConfigInterface) {}

  ngOnInit() {
    if (!this.disabled) {
      const config = new PerfectScrollbarConfig(this.defaults);

      config.assign(this.config); // Custom configuration

      this.zone.runOutsideAngular(() => {
        this.instance = new PerfectScrollbar(this.elementRef.nativeElement, config);
      });

      if (!this.configDiff) {
        this.configDiff = this.differs.find(this.config || {}).create();

        this.configDiff.diff(this.config || {});
      }

      this.zone.runOutsideAngular(() => {
        this.ro = new ResizeObserver((entries, observer) => {
          this.update();
        });

        this.ro.observe(this.elementRef.nativeElement);
      });
    }
  }

  ngOnDestroy() {
    if (this.ro) {
      this.ro.disconnect();
    }

    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }

    if (this.instance) {
      this.zone.runOutsideAngular(() => {
        this.instance.destroy();
      });

      this.instance = null;
    }
  }

  ngDoCheck() {
    if (!this.disabled && this.configDiff) {
      const changes = this.configDiff.diff(this.config || {});

      if (changes) {
        this.ngOnDestroy();

        this.ngOnInit();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['disabled'] && !changes['disabled'].isFirstChange()) {
      if (changes['disabled'].currentValue !== changes['disabled'].previousValue) {
        if (changes['disabled'].currentValue === true) {
         this.ngOnDestroy();
        } else if (changes['disabled'].currentValue === false) {
          this.ngOnInit();
        }
      }
    }
  }

  public ps() {
    return this.instance;
  }

  public update() {
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }

    this.timeout = window.setTimeout(() => {
      if (!this.disabled && this.configDiff) {
        try {
          this.zone.runOutsideAngular(() => {
            this.instance.update();
          });
        } catch (error) {
          // Update can be finished after destroy so catch errors
        }
      }
    }, 0);
  }

  public geometry(prefix: string = 'scroll'): Geometry {
    return new Geometry(
      this.elementRef.nativeElement[prefix + 'Left'],
      this.elementRef.nativeElement[prefix + 'Top'],
      this.elementRef.nativeElement[prefix + 'Width'],
      this.elementRef.nativeElement[prefix + 'Height']
    );
  }

  public position(absolute: boolean = false): Position {
    if (!absolute) {
      return new Position(
        this.instance.reach.x,
        this.instance.reach.y
      );
    } else {
      return new Position(
        this.elementRef.nativeElement.scrollLeft,
        this.elementRef.nativeElement.scrollTop
      );
    }
  }

  public scrollable(direction: string = 'any'): boolean {
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

  public scrollTo(x: number, y?: number, speed?: number) {
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

  public scrollToX(x: number, speed?: number) {
    this.animateScrolling('scrollLeft', x, speed);
  }

  public scrollToY(y: number, speed?: number) {
    this.animateScrolling('scrollTop', y, speed);
  }

  public scrollToTop(offset?: number, speed?: number) {
    this.animateScrolling('scrollTop', (offset || 0), speed);
  }

  public scrollToLeft(offset?: number, speed?: number) {
    this.animateScrolling('scrollLeft', (offset || 0), speed);
  }

  public scrollToRight(offset?: number, speed?: number) {
    const left = this.elementRef.nativeElement.scrollWidth -
      this.elementRef.nativeElement.clientWidth;

    this.animateScrolling('scrollLeft', left - (offset || 0), speed);
  }

  public scrollToBottom(offset?: number, speed?: number) {
    const top = this.elementRef.nativeElement.scrollHeight -
      this.elementRef.nativeElement.clientHeight;

    this.animateScrolling('scrollTop', top - (offset || 0), speed);
  }

  public scrollToId(id: string) {
    const element: HTMLElement | null = document.getElementById(id.toString());
    if (!element) {
      return;
    }
    const elementYPosition: number = element.offsetTop;
    this.animateScrolling('scrollTop', elementYPosition);
  }

  private animateScrolling(target: string, value: number, speed?: number) {
    if (!speed) {
      const oldValue = this.elementRef.nativeElement[target];

      this.elementRef.nativeElement[target] = value;

      if (value !== oldValue) {
        this.instance.update();
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
            this.animateScrolling(target, value, 0);
          } else {
            this.elementRef.nativeElement[target] = oldValue = newValue;

            this.instance.update();

            oldTimestamp = newTimestamp;

            window.requestAnimationFrame(step);
          }
        }
      };

      window.requestAnimationFrame(step);
    }
  }
}
