import { Component, ViewChild } from '@angular/core';

import { PerfectScrollbarComponent, PerfectScrollbarDirective, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  moduleId: module.id + '',
  selector: 'my-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  public config: PerfectScrollbarConfigInterface = {};

  @ViewChild(PerfectScrollbarComponent) componentScroll: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveScroll: PerfectScrollbarDirective;

  constructor() {}

  onScrollToXY(x: number, y: number) {
    this.directiveScroll.scrollTo(x, y, 500);

    this.componentScroll.directiveRef.scrollTo(x, y, 500);
  }

  onScrollToTop() {
    this.directiveScroll.scrollToTop();

    this.componentScroll.directiveRef.scrollToTop();
  }

  onScrollToLeft() {
    this.directiveScroll.scrollToLeft();

    this.componentScroll.directiveRef.scrollToLeft();
  }

  onScrollToRight() {
    this.directiveScroll.scrollToRight();

    this.componentScroll.directiveRef.scrollToRight();
  }

  onScrollToBottom() {
    this.directiveScroll.scrollToBottom();

    this.componentScroll.directiveRef.scrollToBottom();
  }
}
