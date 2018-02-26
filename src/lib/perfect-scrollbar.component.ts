import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { distinctUntilChanged } from 'rxjs/operators';

import { Component,
  ViewChild, EventEmitter, HostBinding,
  OnInit, OnDestroy, DoCheck, Input, Output,
  ViewEncapsulation, ChangeDetectorRef } from '@angular/core';

import { PerfectScrollbarDirective } from './perfect-scrollbar.directive';
import { PerfectScrollbarConfigInterface } from './perfect-scrollbar.interfaces';

@Component({
  selector: 'perfect-scrollbar',
  exportAs: 'ngxPerfectScrollbar',
  templateUrl: './lib/perfect-scrollbar.component.html',
  styleUrls: [ './lib/perfect-scrollbar.component.css' ],
  encapsulation: ViewEncapsulation.None
})
export class PerfectScrollbarComponent implements OnInit, OnDestroy, DoCheck {
  public states: any = {};

  public indicatorX: boolean = false;
  public indicatorY: boolean = false;

  public interaction: boolean = false;

  private stateTimeout: number = null;

  private stateSub: Subscription = null;

  private scrollPositionX: number = null;
  private scrollPositionY: number = null;

  private scrollDirectionX: number = null;
  private scrollDirectionY: number = null;

  private usePropagationX: boolean = false;
  private usePropagationY: boolean = false;

  private allowPropagationX: boolean = false;
  private allowPropagationY: boolean = false;

  private stateUpdate: Subject<string> = new Subject();

  @Input() disabled: boolean = false;

  @Input() usePSClass: boolean = true;

  @HostBinding('class.ps-show-limits')
  @Input() autoPropagation: boolean = false;

  @HostBinding('class.ps-show-active')
  @Input() scrollIndicators: boolean = false;

  @Input() config: PerfectScrollbarConfigInterface;

  @ViewChild(PerfectScrollbarDirective) directiveRef: PerfectScrollbarDirective;

  @Output('psScrollY'        ) PS_SCROLL_Y            = new EventEmitter<any>();
  @Output('psScrollX'        ) PS_SCROLL_X            = new EventEmitter<any>();

  @Output('psScrollUp'       ) PS_SCROLL_UP           = new EventEmitter<any>();
  @Output('psScrollDown'     ) PS_SCROLL_DOWN         = new EventEmitter<any>();
  @Output('psScrollLeft'     ) PS_SCROLL_LEFT         = new EventEmitter<any>();
  @Output('psScrollRight'    ) PS_SCROLL_RIGHT        = new EventEmitter<any>();

  @Output('psYReachEnd'      ) PS_Y_REACH_END         = new EventEmitter<any>();
  @Output('psYReachStart'    ) PS_Y_REACH_START       = new EventEmitter<any>();
  @Output('psXReachEnd'      ) PS_X_REACH_END         = new EventEmitter<any>();
  @Output('psXReachStart'    ) PS_X_REACH_START       = new EventEmitter<any>();

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.stateSub = this.stateUpdate
      .pipe(
        distinctUntilChanged((a, b) => (a === b && !this.stateTimeout))
      )
      .subscribe((state: string) => {
        if (this.stateTimeout) {
          window.clearTimeout(this.stateTimeout);

          this.stateTimeout = null;
        }

        if (state === 'x' || state === 'y') {
          this.interaction = false;

          if (state === 'x') {
            this.indicatorX = false;

            this.states.left = false;
            this.states.right = false;

            if (this.autoPropagation && this.usePropagationX) {
              this.allowPropagationX = false;
            }
          } else if (state === 'y') {
            this.indicatorY = false;

            this.states.top = false;
            this.states.bottom = false;

            if (this.autoPropagation && this.usePropagationY) {
              this.allowPropagationY = false;
            }
          }
        } else {
          if (state === 'left' || state === 'right') {
            this.states.left = false;
            this.states.right = false;

            this.states[state] = true;

            if (this.autoPropagation && this.usePropagationX) {
              this.indicatorX = true;
            }
          } else if (state === 'top' || state === 'bottom') {
            this.states.top = false;
            this.states.bottom = false;

            this.states[state] = true;

            if (this.autoPropagation && this.usePropagationY) {
              this.indicatorY = true;
            }
          }

          if (this.autoPropagation) {
            this.stateTimeout = window.setTimeout(() => {
              this.indicatorX = false;
              this.indicatorY = false;

              this.stateTimeout = null;

              if (this.interaction && (this.states.left || this.states.right)) {
                this.allowPropagationX = true;
              }

              if (this.interaction && (this.states.top || this.states.bottom)) {
                this.allowPropagationY = true;
              }

              this.cdRef.markForCheck();
            }, 500);
          }
        }

        this.cdRef.markForCheck();
        this.cdRef.detectChanges();
      });
  }

  ngOnDestroy() {
    if (this.stateSub) {
      this.stateSub.unsubscribe();
    }

    if (this.stateTimeout) {
      window.clearTimeout(this.stateTimeout);
    }
  }

  ngDoCheck() {
    if (!this.disabled && this.autoPropagation && this.directiveRef) {
      const element = this.directiveRef.elementRef.nativeElement;

      this.usePropagationX = element.classList.contains('ps--active-x');

      this.usePropagationY = element.classList.contains('ps--active-y');
    }
  }

  private checkPropagation(event: any, deltaX: number, deltaY: number) {
    this.interaction = true;

    const scrollDirectionX = (deltaX < 0) ? -1 : 1;
    const scrollDirectionY = (deltaY < 0) ? -1 : 1;

    if ((this.usePropagationX && this.usePropagationY) ||
        (this.usePropagationX && (!this.allowPropagationX ||
        (this.scrollDirectionX !== scrollDirectionX))) ||
        (this.usePropagationY && (!this.allowPropagationY ||
        (this.scrollDirectionY !== scrollDirectionY))))
    {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!!deltaX) {
      this.scrollDirectionX = scrollDirectionX;
    }

    if (!!deltaY) {
      this.scrollDirectionY = scrollDirectionY;
    }

    this.stateUpdate.next('interaction');

    this.cdRef.detectChanges();
  }

  public onWheelEvent(event: WheelEvent) {
    if (!this.disabled && this.autoPropagation) {
      const scrollDeltaX = event.deltaX;
      const scrollDeltaY = event.deltaY;

      this.checkPropagation(event, scrollDeltaX, scrollDeltaY);
    }
  }

  public onTouchEvent(event: TouchEvent) {
    if (!this.disabled && this.autoPropagation) {
      const scrollPositionX = event.touches[0].clientX;
      const scrollPositionY = event.touches[0].clientY;

      const scrollDeltaX = scrollPositionX - this.scrollPositionX;
      const scrollDeltaY = scrollPositionY - this.scrollPositionY;

      this.checkPropagation(event, scrollDeltaX, scrollDeltaY);

      this.scrollPositionX = scrollPositionX;
      this.scrollPositionY = scrollPositionY;
    }
  }

  public onScrollEvent(event: Event, state: string) {
    if (!this.disabled && (this.autoPropagation || this.scrollIndicators)) {
      this.stateUpdate.next(state);
    }
  }
}
