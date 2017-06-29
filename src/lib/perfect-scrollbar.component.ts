import { Subject, Subscription } from 'rxjs';

import { Component, OnInit, OnDestroy, DoCheck, Input, HostBinding, HostListener, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';

import { PerfectScrollbarDirective } from './perfect-scrollbar.directive';
import { PerfectScrollbarConfigInterface } from './perfect-scrollbar.interfaces';

@Component({
  selector: 'perfect-scrollbar',
  templateUrl: './perfect-scrollbar.component.html',
  styleUrls: ['./perfect-scrollbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PerfectScrollbarComponent implements OnInit, OnDestroy, DoCheck {
  private states: any = {};
  private notify: boolean = null;

  private timeout: number = null;

  private usePropagationX: boolean = false;
  private usePropagationY: boolean = false;

  private userInteraction: boolean = false;
  private allowPropagation: boolean = false;

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

  @HostListener('document:touchstart', ['$event']) onTestOne(event: any) {
    // Stop the generated event from reaching window for PS to work correctly
    if (event['psGenerated']) {
      event.stopPropagation();
    }
  }

  constructor(private elementRef: ElementRef, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.activeSub = this.activeUpdate
      .distinctUntilChanged()
      .subscribe((active: boolean) => {
        this.allowPropagation = active;
      });

    this.statesSub = this.statesUpdate
      .distinctUntilChanged()
      .subscribe((state: string) => {
        window.clearTimeout(this.timeout);

        if (state) {
          this.notify = true;
          this.states[state] = true;

          this.cdRef.markForCheck();

          this.timeout = window.setTimeout(() => {
            this.notify = false;

            this.cdRef.markForCheck();
            if (this.autoPropagation && this.userInteraction &&
               ((!this.usePropagationX && (this.states.left || this.states.right)) ||
               (!this.usePropagationY && (this.states.top || this.states.bottom))))
            {
              this.allowPropagation = true;
            }
          }, 300);
        } else {
          this.states = {};
          this.notify = false;

          this.cdRef.markForCheck();

          this.userInteraction = true;

          if (this.autoPropagation &&
            (!this.usePropagationX || !this.usePropagationY))
          {
            this.allowPropagation = false;
          } else if (this.scrollIndicators) {
            this.notify = true;

            this.cdRef.markForCheck();

            this.timeout = window.setTimeout(() => {
              this.notify = false;

              this.cdRef.markForCheck();
            }, 500);
          }
        }
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
    if (!this.disabled && this.autoPropagation && this.directiveRef) {
      const element = this.directiveRef.elementRef.nativeElement;

      this.usePropagationX = !element.classList.contains('ps--active-x');

      this.usePropagationY = !element.classList.contains('ps--active-y');

      this.activeUpdate.next(this.usePropagationX && this.usePropagationY);
    }
  }

  getConfig(): PerfectScrollbarConfigInterface {
    const config = this.config || {};

    if (this.autoPropagation) {
      config.swipePropagation = true;
      config.wheelPropagation = true;
    }

    return config;
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

  onTouchEnd(event: Event = null) {
    if (!this.disabled && this.autoPropagation) {
      if (!this.usePropagationX || !this.usePropagationY) {
        this.allowPropagation = false;
      }
    }
  }

  onTouchMove(event: Event = null) {
    if (!this.disabled && this.autoPropagation) {
      if (!this.allowPropagation) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  onTouchStart(event: Event = null) {
    if (!this.disabled && this.autoPropagation) {
      this.userInteraction = true;

      if (this.allowPropagation) {
        // PS stops the touchmove event so lets re-emit it here
        if (this.elementRef.nativeElement) {
          let newEvent = new MouseEvent('touchstart', event);

          newEvent['psGenerated'] = true;
          newEvent['touches'] = event['touches'];
          newEvent['targetTouches'] = event['targetTouches'];

          this.elementRef.nativeElement.dispatchEvent(newEvent);
        }
      }
    }
  }

  onWheelEvent(event: Event = null) {
    if (!this.disabled && this.autoPropagation) {
      this.userInteraction = true;

      if (!this.allowPropagation) {
        event.preventDefault();
        event.stopPropagation();
      } else if (!this.usePropagationX || !this.usePropagationY) {
        this.allowPropagation = false;
      }
    }
  }

  onReachEvent(event: Event = null, edge: string) {
    if (!this.disabled && (this.autoPropagation || this.scrollIndicators)) {
      this.statesUpdate.next(edge);
    }
  }
}
