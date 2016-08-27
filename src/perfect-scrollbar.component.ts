import * as Ps from 'perfect-scrollbar';

import { Component, DoCheck, OnDestroy, Input, Inject, ElementRef, KeyValueDiffers, AfterViewInit, ViewEncapsulation } from '@angular/core';

import { PerfectScrollbarConfig, PerfectScrollbarConfigInterface } from './perfect-scrollbar.config';

@Component({
  selector: 'perfect-scrollbar',
  template: '<ng-content></ng-content>',
  styleUrls: ["perfect-scrollbar.component.css"],
  encapsulation: ViewEncapsulation.None
})

export class PerfectScrollbarComponent implements DoCheck, OnDestroy, AfterViewInit {
  private width: number;
  private height: number;

  @Input() config: PerfectScrollbarConfigInterface;

  constructor( @Inject(PerfectScrollbarConfig) private defaults: PerfectScrollbarConfig, private elementRef: ElementRef, private differs: KeyValueDiffers ) {
  }

  ngDoCheck() {
    var width = this.elementRef.nativeElement.offsetWidth;
    var height = this.elementRef.nativeElement.offsetHeight;

    if (width !== this.width || height !== this.height) {
      this.width = width;
      this.height = height;

      Ps.update(this.elementRef.nativeElement);
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
