import { Component, ViewChild } from '@angular/core';

import { PerfectScrollbarComponent, PerfectScrollbarDirective } from 'angular2-perfect-scrollbar';

@Component({
  selector: 'my-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  @ViewChild(PerfectScrollbarComponent) componentScroll;
  @ViewChild(PerfectScrollbarDirective) directiveScroll;

  constructor() {}

  onScrollToTop() {
    this.componentScroll.scrollToTop();
    this.directiveScroll.scrollToTop();
  }

  onScrollToBottom() {
    this.componentScroll.scrollToBottom();
    this.directiveScroll.scrollToBottom();
  }
}
