import { Component, DoCheck, AfterViewInit, Input, HostBinding, HostListener, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';

import { PerfectScrollbarDirective } from './perfect-scrollbar.directive';
import { PerfectScrollbarConfigInterface } from './perfect-scrollbar.interfaces';

@Component({
  selector: 'perfect-scrollbar',
  templateUrl: './perfect-scrollbar.component.html',
  styleUrls: ['./perfect-scrollbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PerfectScrollbarComponent implements DoCheck, AfterViewInit {
  @HostBinding('class')
  private state: string = '';

  @HostBinding('class')
  private spacing: string = '';

  private timeout: number = null;

  private usePropagationX: boolean = false;
  private usePropagationY: boolean = false;
  private allowPropagation: boolean = false;

  @HostBinding('hidden')
  @Input() hidden: boolean = false;

  @Input() disabled: boolean = false;

  @Input() usePSClass: boolean = true;

  @Input()
  set flexBreakpoint(bp: string) {
    this.spacing = 'ps-spacing-' + bp;
  };

  @HostBinding('class.ps-show-limits')
  @Input() autoPropagation: boolean = false;

  @Input() runInsideAngular: boolean = false;

  @Input() config: PerfectScrollbarConfigInterface;

  @ViewChild(PerfectScrollbarDirective) directiveRef: PerfectScrollbarDirective;

  @HostListener('touchmove', ['$event']) onMove(event: any) {
    if (!this.disabled && this.autoPropagation)
    {
      event.stopPropagation();
    }
  }

  @HostListener('touchstart', ['$event']) onStart(event: any) {
    if (!this.disabled && this.autoPropagation) {
      this.allowPropagation = true;
    }

    if (!this.disabled && this.autoPropagation &&
        this.directiveRef && this.directiveRef.settings &&
        this.directiveRef.settings.swipePropagation)
    {
      if (!this.usePropagationX || !this.usePropagationY) {
        console.log("OFF");
        this.directiveRef.settings.swipePropagation = false;
        this.directiveRef.settings.wheelPropagation = false;
      }

      if (this.elementRef.nativeElement.parentElement) {
        let newEvent = new MouseEvent('touchstart', event);

        newEvent['touches'] = event.touches;
        newEvent['targetTouches'] = event.targetTouches;

        this.elementRef.nativeElement.parentElement.dispatchEvent(newEvent);
      }
    }
  }

  @HostListener('ps-x-reach-end', ['$event']) onEndX(event: any) {
    if (!this.disabled && this.autoPropagation &&
        !this.usePropagationX && this.allowPropagation)
    {
      this.setPropagation(true, 'ps-end-x');
    }
  }

  @HostListener('ps-y-reach-end', ['$event']) onEndY(event: any) {
    if (!this.disabled && this.autoPropagation &&
        !this.usePropagationY && this.allowPropagation)
    {
      this.setPropagation(true, 'ps-end-y');
    }
  }

  @HostListener('ps-x-reach-start', ['$event']) onStartX(event: any) {
    if (!this.disabled && this.autoPropagation &&
        !this.usePropagationX && this.allowPropagation)
    {
      this.setPropagation(true, 'ps-start-x');
    }
  }

  @HostListener('ps-y-reach-start', ['$event']) onStartY(event: any) {
    if (!this.disabled && this.autoPropagation &&
        !this.usePropagationY && this.allowPropagation)
    {
      this.setPropagation(true, 'ps-start-y');
    }
  }

  @HostListener('ps-scroll-x', ['$event']) onScrollX(event: any) {
    if (!this.disabled && this.autoPropagation && !this.usePropagationX) {
      this.setPropagation(false, 'ps-scroll-x');
    }
  }

  @HostListener('ps-scroll-y', ['$event']) onScrollY(event: any) {
    if (!this.disabled && this.autoPropagation && !this.usePropagationY) {
      this.setPropagation(false, 'ps-scroll-y');
    }
  }

  constructor(private elementRef: ElementRef, private cdRef: ChangeDetectorRef) {}

  ngDoCheck() {
    if (!this.disabled && this.directiveRef && this.directiveRef.elementRef.nativeElement) {
      if (this.autoPropagation) {
        const element = this.directiveRef.elementRef.nativeElement;

        this.usePropagationX = !element.classList.contains('ps--active-x');

        this.usePropagationY = !element.classList.contains('ps--active-y');

        this.directiveRef.settings.swipePropagation = this.usePropagationX && this.usePropagationY;
        this.directiveRef.settings.wheelPropagation = this.usePropagationX && this.usePropagationY;
      }
    }
  }

  ngAfterViewInit() {
    if (!this.disabled) {
      if (this.autoPropagation) {
        this.directiveRef.settings.swipePropagation = false;
        this.directiveRef.settings.wheelPropagation = false;

        this.cdRef.markForCheck();
      }
    }
  }

  update() {
    console.warn('Deprecated, call API through directive reference (#reference="PerfectScrollbarDirective")');

    this.directiveRef.update();
  }

  scrollTo(x: number, y?: number) {
    console.warn('Deprecated function, you should call PS API through directiveRef!');

    this.directiveRef.scrollTo(x, y);
  }

  scrollToTop(offset: number = 0) {
    console.warn('Deprecated function, you should call PS API through directiveRef!');

    this.directiveRef.scrollToTop(offset);
  }

  scrollToLeft(offset: number = 0) {
    console.warn('Deprecated function, you should call PS API through directiveRef!');

    this.directiveRef.scrollToLeft(offset);
  }

  scrollToRight(offset: number = 0) {
    console.warn('Deprecated function, you should call PS API through directiveRef!');

    this.directiveRef.scrollToRight(offset);
  }

  scrollToBottom(offset: number = 0) {
    console.warn('Deprecated function, you should call PS API through directiveRef!');

    this.directiveRef.scrollToBottom(offset);
  }

  setPropagation(setting: boolean = false, state: string) {
    this.state = state;
console.log(state);
    window.clearTimeout(this.timeout);

    if (setting) {
      this.timeout = window.setTimeout(() => {
        console.log("ON");
        this.state = '';

        this.cdRef.markForCheck();

        this.timeout = window.setTimeout(() => {
          this.directiveRef.settings.swipePropagation = true;
          this.directiveRef.settings.wheelPropagation = true;
        }, 0);
      }, 1000);
    } else {
      console.log("OFF");
      this.allowPropagation = true;

      this.directiveRef.settings.swipePropagation = false;
      this.directiveRef.settings.wheelPropagation = false;
    }
  }
}
