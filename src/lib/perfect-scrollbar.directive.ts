import * as Ps from 'perfect-scrollbar';

import { Directive, DoCheck, OnDestroy, OnChanges, AfterViewInit, Input, Optional, HostBinding, ElementRef, SimpleChanges, KeyValueDiffers, NgZone } from '@angular/core';

import { PerfectScrollbarConfig, PerfectScrollbarConfigInterface } from './perfect-scrollbar.interfaces';

@Directive({
  selector: '[perfect-scrollbar]',
  host: {
    style: 'position: relative;'
  }
})
export class PerfectScrollbarDirective implements DoCheck, OnDestroy, OnChanges, AfterViewInit {
  private width: number;
  private height: number;

  private configDiff: any;

  private contentWidth: number;
  private contentHeight: number;

  @HostBinding('hidden')
  @Input() hidden: boolean = false;

  @Input() disabled: boolean = false;

  @Input() runInsideAngular: boolean = false;

  @Input('perfect-scrollbar') config: PerfectScrollbarConfigInterface;

  @HostBinding('class.ps') @Input() usePSClass: boolean = true;

  constructor( public elementRef: ElementRef, @Optional() private defaults: PerfectScrollbarConfig, private differs: KeyValueDiffers, private zone: NgZone ) {}

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

        if (width !== this.width || height !== this.height || contentWidth !== this.contentWidth || contentHeight !== this.contentHeight) {
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
      let config = new PerfectScrollbarConfig(this.defaults);

      config.assign(this.config);

      if (this.runInsideAngular) {
        Ps.initialize(this.elementRef.nativeElement, config);
      } else {
        this.zone.runOutsideAngular(() => {
          Ps.initialize(this.elementRef.nativeElement, config);
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

  scrollTo(x: number, y?: number) {
    if (!this.disabled) {
      if (y == null) {
        this.elementRef.nativeElement.scrollTop = x;
      } else {
        this.elementRef.nativeElement.scrollTop = y;

        this.elementRef.nativeElement.scrollLeft = x;
      }

      this.update();
    }
  }

  scrollToTop(offset: number = 0) {
    if (!this.disabled) {
      this.elementRef.nativeElement.scrollTop = 0 + offset;

      this.update();
    }
  }

  scrollToLeft(offset: number = 0) {
    if (!this.disabled) {
      this.elementRef.nativeElement.scrollLeft = 0 + offset;

      this.update();
    }
  }

  scrollToRight(offset: number = 0) {
    if (!this.disabled) {
      let width = this.elementRef.nativeElement.scrollWidth;

      this.elementRef.nativeElement.scrollLeft = width - offset;

      this.update();
    }
  }

  scrollToBottom(offset: number = 0) {
    if (!this.disabled) {
      let height = this.elementRef.nativeElement.scrollHeight;

      this.elementRef.nativeElement.scrollTop = height - offset;

      this.update();
    }
  }
}
