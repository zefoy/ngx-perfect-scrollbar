import PerfectScrollbar from 'perfect-scrollbar';

import ResizeObserver from 'resize-observer-polyfill';

import { isPlatformBrowser } from '@angular/common';
import { Directive,
  OnInit, DoCheck, OnChanges, OnDestroy, Input, Output,
  EventEmitter, HostListener, NgZone, ElementRef, Optional, Inject,
  SimpleChanges, KeyValueDiffer, KeyValueDiffers, PLATFORM_ID } from '@angular/core';

import { Geometry, Position } from './perfect-scrollbar.interfaces';

import { PERFECT_SCROLLBAR_CONFIG } from './perfect-scrollbar.interfaces';

import { PerfectScrollbarEvents, PerfectScrollbarConfig,
  PerfectScrollbarConfigInterface } from './perfect-scrollbar.interfaces';

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

  @Output('psScrollY'        ) PS_SCROLL_Y            = new EventEmitter<any>();
  @Output('psScrollX'        ) PS_SCROLL_X            = new EventEmitter<any>();

  @Output('psScrollUp'       ) PS_SCROLL_UP           = new EventEmitter<any>();
  @Output('psScrollDown'     ) PS_SCROLL_DOWN         = new EventEmitter<any>();
  @Output('psScrollLeft'     ) PS_SCROLL_LEFT         = new EventEmitter<any>();
  @Output('psScrollRight'    ) PS_SCROLL_RIGHT        = new EventEmitter<any>();

  @Output('psYReachEnd'      ) PS_Y_REACH_END         = new EventEmitter<any>();
  @Output('psYReachStart'    ) PS_Y_REACH_START       = new EventEmitter<any>();
  @Output('psXReachEnd'      ) PS_X_REACH_END         = new EventEmitter<any>();
  @Output('psXReachStart'    ) PS_X_REACH_START       = new EventEmitter<any>();

  private emit(event: any) { this[event.type.replace(/-/g, '_').toUpperCase()].emit(event); }

  @HostListener('ps-scroll-y', ['$event'])       psScrollY(event: any) { this.emit(event); }
  @HostListener('ps-scroll-x', ['$event'])       psScrollX(event: any) { this.emit(event); }

  @HostListener('ps-scroll-up', ['$event'])      psScrollUp(event: any) { this.emit(event); }
  @HostListener('ps-scroll-down', ['$event'])    psScrollDown(event: any) { this.emit(event); }
  @HostListener('ps-scroll-left', ['$event'])    psScrollLeft(event: any) { this.emit(event); }
  @HostListener('ps-scroll-right', ['$event'])   psScrollRight(event): any { this.emit(event); }

  @HostListener('ps-y-reach-end', ['$event'])    psReachEndY(event): any { this.emit(event); }
  @HostListener('ps-y-reach-start', ['$event'])  psReachStartY(event): any { this.emit(event); }
  @HostListener('ps-x-reach-end', ['$event'])    psReachEndX(event): any { this.emit(event); }
  @HostListener('ps-x-reach-start', ['$event'])  psReachStartX(event): any { this.emit(event); }

  constructor(private zone: NgZone, private differs: KeyValueDiffers,
    public elementRef: ElementRef, @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(PERFECT_SCROLLBAR_CONFIG) private defaults: PerfectScrollbarConfigInterface) {}

  ngOnInit() {
    if (!this.disabled && isPlatformBrowser(this.platformId)) {
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

        if (this.elementRef.nativeElement.children[0]) {
          this.ro.observe(this.elementRef.nativeElement.children[0]);
        }

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
    if (!this.disabled && this.configDiff && isPlatformBrowser(this.platformId)) {
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
            if (this.instance) {
              this.instance.update();
            }
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

  public scrollToElement(qs: string, offset?: number, speed?: number) {
    const element = this.elementRef.nativeElement.querySelector(qs);

    if (element) {
      if (this.elementRef.nativeElement.classList.contains('ps--active-x')) {
        this.animateScrolling('scrollLeft', element.offsetLeft + (offset || 0), speed);
      }

      if (this.elementRef.nativeElement.classList.contains('ps--active-y')) {
        this.animateScrolling('scrollTop', element.offsetTop + (offset || 0), speed);
      }
    }
  }

  private animateScrolling(target: string, value: number, speed?: number) {
    if (!speed) {
      const oldValue = this.elementRef.nativeElement[target];

      this.elementRef.nativeElement[target] = value;

      if (this.instance && value !== oldValue) {
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
            this.elementRef.nativeElement[target] = newValue;

            // On a zoomed out page the resulting offset may differ
            oldValue = this.elementRef.nativeElement[target];

            if (this.instance) {
              this.instance.update();
            }

            oldTimestamp = newTimestamp;

            window.requestAnimationFrame(step);
          }
        }
      };

      window.requestAnimationFrame(step);
    }
  }
}
