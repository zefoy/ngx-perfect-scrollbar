import * as Ps from 'perfect-scrollbar';

import { Directive, DoCheck, OnDestroy, OnChanges, AfterViewInit, Input, Optional, HostBinding, HostListener, ElementRef, SimpleChanges, KeyValueDiffers, NgZone } from '@angular/core';

import { PerfectScrollbarConfig, PerfectScrollbarConfigInterface } from './perfect-scrollbar.interfaces';

@Directive({
  selector: '[perfect-scrollbar]',
  exportAs: 'ngxPerfectScrollbar'
})
export class PerfectScrollbarDirective implements DoCheck, OnDestroy, OnChanges, AfterViewInit {
  public settings: PerfectScrollbarConfig = null;

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

  @Input() runInsideAngular: boolean = false;

  @Input('perfect-scrollbar') config: PerfectScrollbarConfigInterface;

  @HostListener('window:resize', ['$event']) onResize($event: Event): void {
    this.update();
  }

  constructor(public elementRef: ElementRef, @Optional() private defaults: PerfectScrollbarConfig, private differs: KeyValueDiffers, private zone: NgZone) {}

  ngDoCheck() {
    if (!this.disabled && this.configDiff) {
      let changes = this.configDiff.diff(this.config || {});

      if (changes) {
        this.ngOnDestroy();

        // Timeout is needed for the styles to update properly
        setTimeout(() => {
          this.ngAfterViewInit();
        }, 0);
      } else if (this.elementRef.nativeElement) {
        let contentWidth = this.contentWidth;
        let contentHeight = this.contentHeight;

        let width = this.elementRef.nativeElement.offsetWidth;
        let height = this.elementRef.nativeElement.offsetHeight;

        if (this.elementRef.nativeElement.children && this.elementRef.nativeElement.children.length) {
          contentWidth = this.elementRef.nativeElement.children[0].offsetWidth;
          contentHeight = this.elementRef.nativeElement.children[0].offsetHeight;
        }

        if (width !== this.width || height !== this.height ||
            contentWidth !== this.contentWidth || contentHeight !== this.contentHeight)
        {
          this.width = width;
          this.height = height;

          this.contentWidth = contentWidth;
          this.contentHeight = contentHeight;

          this.update();
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.runInsideAngular) {
      Ps.destroy(this.elementRef.nativeElement);
    } else {
      this.zone.runOutsideAngular(() => {
        Ps.destroy(this.elementRef.nativeElement);
      });
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
      this.settings = new PerfectScrollbarConfig(this.defaults);

      this.settings.assign(this.config);

      if (this.runInsideAngular) {
        Ps.initialize(this.elementRef.nativeElement, this.settings);
      } else {
        this.zone.runOutsideAngular(() => {
          Ps.initialize(this.elementRef.nativeElement, this.settings);
        });
      }

      if (!this.configDiff) {
        this.configDiff = this.differs.find(this.config || {}).create(null);
      }
    }
  }

  update() {
    if (!this.disabled) {
      if (this.runInsideAngular) {
        Ps.update(this.elementRef.nativeElement);
      } else {
        this.zone.runOutsideAngular(() => {
          Ps.update(this.elementRef.nativeElement);
        });
      }
    }
  }

  position(): any {
    return {
      top: this.elementRef.nativeElement.scrollTop,
      left: this.elementRef.nativeElement.scrollLeft
    };
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
    this.scrollTo(x, null, speed);
  }

  scrollToY(y: number, speed?: number) {
    this.scrollTo(null, y, speed);
  }

  scrollToTop(offset: number = 0, speed?: number) {
    this.scrollToY(this.elementRef.nativeElement.scrollTop = 0 + offset, speed);
  }

  scrollToLeft(offset: number = 0, speed?: number) {
    this.scrollToX(this.elementRef.nativeElement.scrollLeft = 0 + offset, speed);
  }

  scrollToRight(offset: number = 0, speed?: number) {
    const width = this.elementRef.nativeElement.scrollWidth;

    this.scrollToX(this.elementRef.nativeElement.scrollLeft = width - offset, speed);
  }

  scrollToBottom(offset: number = 0, speed?: number) {
    const height = this.elementRef.nativeElement.scrollHeight;

    this.scrollToY(this.elementRef.nativeElement.scrollTop = height - offset, speed);
  }

  animateScrolling(target: string, value: number, speed?: number) {
    if (!speed) {
      this.elementRef.nativeElement[target] = value;

      this.update();
    } else {
      let scrollCount = 0;

      let oldTimestamp = Date.now();

      let oldValue = this.elementRef.nativeElement[target];

      let cosParameter = Math.abs(oldValue - value) / 2;

      let step = (newTimestamp) => {
        scrollCount += Math.PI / (speed / (newTimestamp - oldTimestamp));

        let newValue = Math.round(cosParameter + cosParameter * Math.cos(scrollCount));

        // Only continue animation if scroll position has not changed
        if (this.elementRef.nativeElement[target] === oldValue) {
          if (scrollCount >= Math.PI || newValue === value) {
            this.elementRef.nativeElement[target] = value;

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
