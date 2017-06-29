import { Subject, Subscription } from 'rxjs';

import { Component, OnInit, OnDestroy, DoCheck, AfterViewInit, Input, HostBinding, HostListener, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';

import { PerfectScrollbarDirective } from './perfect-scrollbar.directive';
import { PerfectScrollbarConfigInterface } from './perfect-scrollbar.interfaces';

@Component({
  selector: 'perfect-scrollbar',
  templateUrl: './perfect-scrollbar.component.html',
  styleUrls: ['./perfect-scrollbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PerfectScrollbarComponent implements OnInit, OnDestroy, DoCheck, AfterViewInit {
  private states: any = {};
  private notify: boolean = null;

  private timeout: number = null;

  private userInteraction: boolean = false;

  private usePropagationX: boolean = false;
  private usePropagationY: boolean = false;

  private statesSub: Subscription = null;
  private statesUpdate: Subject<string> = new Subject();

  private activeSub: Subscription = null;
  private activeUpdate: Subject<boolean> = new Subject();

  @HostBinding('hidden')
  @Input() hidden: boolean = false;

  @Input() disabled: boolean = false;

  @Input() usePSClass: boolean = true;

  @Input() flexBreakpoint: string = '';
  @Input() autoPropagation: boolean = false;
  @Input() scrollIndicators: boolean = false;

  @Input() runInsideAngular: boolean = false;

  @Input() config: PerfectScrollbarConfigInterface;

  @HostBinding('class')
  get cssClasses(): string {
    return 'ps-spacing-' + (this.flexBreakpoint || 'none') +
           (this.autoPropagation ? ' ps-show-limits' : '') +
           (this.scrollIndicators ? ' ps-show-active' : '');
  }

  @ViewChild(PerfectScrollbarDirective) directiveRef: PerfectScrollbarDirective;



  /*@HostListener('touchmove', ['$event']) onMove(event: any) {
    if (!this.disabled && this.autoPropagation &&
        this.directiveRef && this.directiveRef.settings &&
        !this.directiveRef.settings.swipePropagation)
    {
      event.stopPropagation();
    }
  }*/

  @HostListener('touchstart', ['$event']) onStart(event: any) {
    console.log("TS", event);
    if (!this.disabled && this.autoPropagation) {
      this.userInteraction = true;
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
    }
  }
  @HostListener('document:touchstart', ['$event']) onTestOne(event: any) {
    event.stopPropagation();
  }

  @HostListener('ps-x-reach-end', ['$event']) onEndX(event: any) {
    if (!this.disabled && (this.autoPropagation || this.scrollIndicators)) {
      this.statesUpdate.next('right');
    }
  }

  @HostListener('ps-y-reach-end', ['$event']) onEndY(event: any) {
    if (!this.disabled && (this.autoPropagation || this.scrollIndicators)) {
      this.statesUpdate.next('bottom');
    }
  }

  @HostListener('ps-x-reach-start', ['$event']) onStartX(event: any) {
    if (!this.disabled && (this.autoPropagation || this.scrollIndicators)) {
      this.statesUpdate.next('left');
    }
  }

  @HostListener('ps-y-reach-start', ['$event']) onStartY(event: any) {
    if (!this.disabled && (this.autoPropagation || this.scrollIndicators)) {
      this.statesUpdate.next('top');
    }
  }

  @HostListener('ps-scroll-x', ['$event']) onScrollX(event: any) {
    if (!this.disabled && (this.autoPropagation || this.scrollIndicators)) {
      this.statesUpdate.next(null);
    }
  }

  @HostListener('ps-scroll-y', ['$event']) onScrollY(event: any) {
    if (!this.disabled && (this.autoPropagation || this.scrollIndicators)) {
      this.statesUpdate.next(null);
    }
  }

  constructor(private elementRef: ElementRef, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.activeSub = this.activeUpdate
      .distinctUntilChanged()
      .subscribe((active: boolean) => {
        this.directiveRef.settings.swipePropagation = active;
        this.directiveRef.settings.wheelPropagation = active;
      });

    this.statesSub = this.statesUpdate
      .distinctUntilChanged()
      .subscribe((state: string) => {
        window.clearTimeout(this.timeout);

        window.setTimeout(() => {
          if (state) {
            this.notify = true;
            this.states[state] = true;

            this.cdRef.markForCheck();

            this.timeout = window.setTimeout(() => {
              this.notify = false;

              this.cdRef.markForCheck();

              if (this.autoPropagation && this.userInteraction &&
                 ((!this.usePropagationX && (state === 'left' || state === 'right')) ||
                 (!this.usePropagationY && (state === 'top' || state === 'bottom'))))
              {
                console.log("ON");
                this.directiveRef.settings.swipePropagation = true;
                this.directiveRef.settings.wheelPropagation = true;
              }
            }, 500);
          } else {
            this.states = {};
            this.notify = false;

            this.cdRef.markForCheck();

            this.userInteraction = true;

            if (this.autoPropagation &&
              (!this.usePropagationX || !this.usePropagationY))
            {
              console.log("OFF");
              this.directiveRef.settings.swipePropagation = false;
              this.directiveRef.settings.wheelPropagation = false;
            } else if (this.scrollIndicators) {
              this.notify = true;

              this.cdRef.markForCheck();

              this.timeout = window.setTimeout(() => {
                this.notify = false;

                this.cdRef.markForCheck();
              }, 500);
            }
          }
        }, 0);
      });
  }

  ngOnDestroy() {
    if (this.activeSub) {
      this.activeSub.unsubscribe();
    }

    if (this.statesSub) {
      this.statesSub.unsubscribe();
    }
  }

  ngDoCheck() {
    if (!this.disabled && this.autoPropagation &&
        this.directiveRef && this.directiveRef.settings)
    {
      const element = this.directiveRef.elementRef.nativeElement;

      this.usePropagationX = !element.classList.contains('ps--active-x');

      this.usePropagationY = !element.classList.contains('ps--active-y');

      this.activeUpdate.next(this.usePropagationX && this.usePropagationY);
    }
  }

  ngAfterViewInit() {
    if (!this.disabled && this.autoPropagation) {
      this.directiveRef.settings.swipePropagation = false;
      this.directiveRef.settings.wheelPropagation = false;
    }

    if (!this.disabled && (this.autoPropagation || this.scrollIndicators)) {
      this.cdRef.markForCheck();
      this.cdRef.detectChanges();
    }
  }

  update() {
    console.warn('Deprecated function, update needs to be called through directiveRef!');

    this.directiveRef.update();
  }

  scrollTo(x: number, y?: number) {
    console.warn('Deprecated function, scrollTo needs to be called through directiveRef!');

    this.directiveRef.scrollTo(x, y);
  }

  scrollToTop(offset: number = 0) {
    console.warn('Deprecated function, scrollToTop needs to be called through directiveRef!');

    this.directiveRef.scrollToTop(offset);
  }

  scrollToLeft(offset: number = 0) {
    console.warn('Deprecated function, scrollToLeft needs to be called through directiveRef!');

    this.directiveRef.scrollToLeft(offset);
  }

  scrollToRight(offset: number = 0) {
    console.warn('Deprecated function, scrollToRight needs to be called through directiveRef!');

    this.directiveRef.scrollToRight(offset);
  }

  scrollToBottom(offset: number = 0) {
    console.warn('Deprecated function, scrollToBottom needs to be called through directiveRef!');

    this.directiveRef.scrollToBottom(offset);
  }

  onTouchStart(event: Event = null) {
    // PS stops the touchmove event so we duplicate it here
console.log("START", this.directiveRef.settings.swipePropagation);
    if (!this.disabled && this.autoPropagation &&
        this.directiveRef && this.directiveRef.settings &&
        this.directiveRef.settings.swipePropagation)
    {
      if (this.elementRef.nativeElement) {
        console.log("SEND");
        let newEvent = new MouseEvent('touchstart', event);

        newEvent['touches'] = event['touches'];
        newEvent['targetTouches'] = event['targetTouches'];

        this.elementRef.nativeElement.dispatchEvent(newEvent);
      }
    }
  }
}
