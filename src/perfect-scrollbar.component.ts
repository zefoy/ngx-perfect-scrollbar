import * as Ps from 'perfect-scrollbar';

import { Component, DoCheck, OnDestroy, Input, Optional, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';

import { PerfectScrollbarConfig, PerfectScrollbarConfigInterface } from './perfect-scrollbar.interfaces';

@Component({
  selector: 'perfect-scrollbar',
  template: '<div class="ps-content"><ng-content></ng-content></div>',
  styles: [require('perfect-scrollbar/dist/css/perfect-scrollbar.min.css')],
  encapsulation: ViewEncapsulation.None
})
export class PerfectScrollbarComponent implements DoCheck, OnDestroy, AfterViewInit {
  private width: number;
  private height: number;

  private contentWidth: number;
  private contentHeight: number;

  @Input() config: PerfectScrollbarConfigInterface;

  constructor( private elementRef: ElementRef, @Optional() private defaults: PerfectScrollbarConfig ) {}

  ngDoCheck() {
    if (this.elementRef.nativeElement.children) {
      var width = this.elementRef.nativeElement.offsetWidth;
      var height = this.elementRef.nativeElement.offsetHeight;

      var contentWidth = this.elementRef.nativeElement.children[0].offsetWidth;
      var contentHeight = this.elementRef.nativeElement.children[0].offsetHeight;

      if (width !== this.width || height !== this.height || contentWidth !== this.contentWidth || contentHeight !== this.contentHeight) {
        this.width = width;
        this.height = height;

        this.contentWidth = contentWidth;
        this.contentHeight = contentHeight;

        Ps.update(this.elementRef.nativeElement);
      }
    }
  }

  ngOnDestroy() {
    Ps.destroy(this.elementRef.nativeElement);
  }

  ngAfterViewInit() {
    let config = new PerfectScrollbarConfig(this.defaults);

    config.assign(this.config);

    Ps.initialize(this.elementRef.nativeElement, config);
  }

  update() {
    Ps.update(this.elementRef.nativeElement);
  }

  scrollTo(position: number) {
    this.elementRef.nativeElement.scrollTop = position;

    Ps.update(this.elementRef.nativeElement);
  }
}
