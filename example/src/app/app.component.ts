import { Component, ViewChild } from '@angular/core';

import { PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'my-app',
  moduleId: 'src/app/app.component',
  templateUrl: 'app.component.html',
  styleUrls: [ 'app.component.css' ]
})
export class AppComponent {
  public type: string = 'component';

  public disabled: boolean = false;

  public config: PerfectScrollbarConfigInterface = {suppressScrollX: true};

  @ViewChild(PerfectScrollbarComponent) componentScroll: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveScroll: PerfectScrollbarDirective;

  constructor() {}

  public toggleType() {
    this.type = (this.type === 'component') ? 'directive' : 'component';
  }

  public toggleDisabled() {
    this.disabled = !this.disabled;
  }

  public scrollToXY(x: number, y: number) {
    if (this.type === 'directive') {
      this.directiveScroll.scrollTo(x, y, 500);
    } else {
      this.componentScroll.directiveRef.scrollTo(x, y, 500);
    }
  }

  public scrollToTop() {
    if (this.type === 'directive') {
      this.directiveScroll.scrollToTop();
    } else {
      this.componentScroll.directiveRef.scrollToTop();
    }
  }

  public scrollToLeft() {
    if (this.type === 'directive') {
      this.directiveScroll.scrollToLeft();
    } else {
      this.componentScroll.directiveRef.scrollToLeft();
    }
  }

  public scrollToRight() {
    if (this.type === 'directive') {
      this.directiveScroll.scrollToRight();
    } else {
      this.componentScroll.directiveRef.scrollToRight();
    }
  }

  public scrollToBottom() {
    if (this.type === 'directive') {
      this.directiveScroll.scrollToBottom();
    } else {
      this.componentScroll.directiveRef.scrollToBottom();
    }
  }
}
