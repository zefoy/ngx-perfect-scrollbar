import { Component, ViewChild } from '@angular/core';

import { PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

@Component({
  moduleId: module.id + '',
  selector: 'my-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  @ViewChild(PerfectScrollbarComponent) componentScroll;
  @ViewChild(PerfectScrollbarDirective) directiveScroll;

  constructor() {}

  onScrollToXY(x: number, y: number) {
    this.componentScroll.scrollTo(x, y);
    this.directiveScroll.scrollTo(x, y);
  }

  onScrollToTop() {
    this.componentScroll.scrollToTop();
    this.directiveScroll.scrollToTop();
  }

  onScrollToLeft() {
    this.componentScroll.scrollToLeft();
    this.directiveScroll.scrollToLeft();
  }

  onScrollToRight() {
    this.componentScroll.scrollToRight();
    this.directiveScroll.scrollToRight();
  }

  onScrollToBottom() {
    this.componentScroll.scrollToBottom();
    this.directiveScroll.scrollToBottom();
  }
}
