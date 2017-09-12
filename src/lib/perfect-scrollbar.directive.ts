declare var require: any;

import * as Ps from 'perfect-scrollbar';

import { NgZone, Directive, Optional, OnInit, OnDestroy, DoCheck, OnChanges, AfterViewInit,
  SimpleChanges, KeyValueDiffers, Input, HostBinding, HostListener, ElementRef } from '@angular/core';

import { PerfectScrollbarConfig, PerfectScrollbarConfigInterface } from './perfect-scrollbar.interfaces';

const elementResizeDetector = require('element-resize-detector');

@Directive({
  selector: '[perfectScrollbar]',
  exportAs: 'ngxPerfectScrollbar'
})
export class PerfectScrollbarDirective implements OnInit, OnDestroy, DoCheck, OnChanges, AfterViewInit {
  private width: number;
  private height: number;

  private configDiff: any;

  private contentWidth: number;
  private contentHeight: number;

  @HostBinding('hidden')
  @Input() hidden: boolean = false;

  @Input() disabled: boolean = false;

  @HostBinding('class.ps')
  @Input() usePSClass: boolean = true;

  @HostBinding('style.position')
  @Input() psPosStyle: string = 'relative';

  @Input('perfectScrollbar') config: PerfectScrollbarConfigInterface;

  @HostListener('window:resize', ['$event']) onResize($event: Event): void {
    this.update();
  }

  constructor(@Optional() private defaults: PerfectScrollbarConfig, private zone: NgZone,
    public elementRef: ElementRef, private differs: KeyValueDiffers) {}

  ngOnInit() {
    const observer = elementResizeDetector({ strategy: 'scroll' });

    if (this.elementRef.nativeElement.children.length) {
      observer.listenTo(this.elementRef.nativeElement.children[0], (element) => {
        this.update();
      });
    }
  }

  ngOnDestroy() {
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
        setTimeout(() => {
          this.ngAfterViewInit();
        }, 0);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.disabled && this.configDiff) {
      if (changes['hidden'] && !this.hidden) {
        this.update();
      }

      if (changes['disabled'] && !this.disabled) {
        this.ngOnDestroy();
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
        this.configDiff = this.differs.find(this.config || {}).create(null);
      }
    }
  }

  update() {
    setTimeout(() => {
      if (!this.disabled) {
        this.zone.runOutsideAngular(() => {
          Ps.update(this.elementRef.nativeElement);
        });
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

  scrollTo(x: number, y?: number, speed?: number) {
    if (!this.disabled) {
      if (y == null && speed == null) {
        console.warn('Deprecated use of scrollTo, use the scrollToY function instead!');

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

      // PS has weird event sending order, this is a workaround for that
      this.update();

      this.update();
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

            // PS has weird event sending order, this is a workaround for that
            this.update();

            this.update();
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
