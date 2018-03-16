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

  public config: PerfectScrollbarConfigInterface = {};

  @ViewChild(PerfectScrollbarComponent) componentScroll: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveScroll: PerfectScrollbarDirective;

  constructor() {}

  public toggleType(): void {
    this.type = (this.type === 'component') ? 'directive' : 'component';
  }

  public toggleDisabled(): void {
    this.disabled = !this.disabled;
  }

  public scrollToXY(x: number, y: number): void {
    if (this.type === 'directive') {
      this.directiveScroll.scrollTo(x, y, 500);
    } else {
      this.componentScroll.directiveRef.scrollTo(x, y, 500);
    }
  }

  public scrollToTop(): void {
    if (this.type === 'directive') {
      this.directiveScroll.scrollToTop();
    } else {
      this.componentScroll.directiveRef.scrollToTop();
    }
  }

  public scrollToLeft(): void {
    if (this.type === 'directive') {
      this.directiveScroll.scrollToLeft();
    } else {
      this.componentScroll.directiveRef.scrollToLeft();
    }
  }

  public scrollToRight(): void {
    if (this.type === 'directive') {
      this.directiveScroll.scrollToRight();
    } else {
      this.componentScroll.directiveRef.scrollToRight();
    }
  }

  public scrollToBottom(): void {
    if (this.type === 'directive') {
      this.directiveScroll.scrollToBottom();
    } else {
      this.componentScroll.directiveRef.scrollToBottom();
    }
  }

  public onScrollEvent(event: any): void {
    console.log(event);
  }
}
