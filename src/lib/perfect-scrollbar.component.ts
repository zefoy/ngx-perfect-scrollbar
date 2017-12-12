import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { distinctUntilChanged } from 'rxjs/operators';

import { Component, ViewEncapsulation,
  OnInit, OnDestroy, DoCheck, Input, Output,
  ViewChild, EventEmitter, HostBinding, HostListener,
  ElementRef, ChangeDetectorRef } from '@angular/core';

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

  public indicator: boolean = false;
  public interaction: boolean = false;

  private stateTimeout: number = null;

  private stateSub: Subscription = null;

  private positionX: number = null;
  private positionY: number = null;
  private directionX: number = null;
  private directionY: number = null;
  private propagationX: boolean = false;
  private propagationY: boolean = false;

  private usePropagation: boolean = false;
  private allowPropagation: boolean = false;

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

  constructor(private cdRef: ChangeDetectorRef, private elementRef: ElementRef) {}

  ngOnInit() {
    this.stateSub = this.stateUpdate
      .pipe(
        distinctUntilChanged((a, b) => {
          return (a === b && !this.stateTimeout);
        })
      )
      .subscribe((state: string) => {
        if (this.stateTimeout) {
          window.clearTimeout(this.stateTimeout);

          this.stateTimeout = null;
        }

        if (state === 'x' || state === 'y') {
          this.indicator = false;
          this.interaction = false;

          if (state === 'x') {
            this.states.left = false;
            this.states.right = false;
          } else if (state === 'y') {
            this.states.top = false;
            this.states.bottom = false;
          }

          if (this.usePropagation && this.autoPropagation) {
            this.allowPropagation = false;
          }
        } else {
          if (state === 'top') {
            this.states.top = true;
            this.states.bottom = false;
          } else if (state === 'left') {
            this.states.left = true;
            this.states.right = false;
          } else if (state === 'right') {
            this.states.left = false;
            this.states.right = true;
          } else if (state === 'bottom') {
            this.states.top = false;
            this.states.bottom = true;
          }

          if (this.usePropagation && this.autoPropagation) {
            this.indicator = true;

            this.stateTimeout = window.setTimeout(() => {
              this.indicator = false;

              this.stateTimeout = null;

              if (this.interaction &&
                 (this.states.top || this.states.left ||
                  this.states.right || this.states.bottom))
              {
                this.allowPropagation = true;
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

      this.propagationX = element.classList.contains('ps--active-x');
      this.propagationY = element.classList.contains('ps--active-y');

      this.usePropagation = (this.propagationX || !this.propagationY) ||
                            (!this.propagationX && this.propagationY);
    }
  }

  public onWheelEvent(event: WheelEvent) {
    if (!this.disabled && this.autoPropagation) {
      this.interaction = true;

      const directionX = (event.deltaX < 0) ? -1 : 1;
      const directionY = (event.deltaY < 0) ? -1 : 1;

      if (this.usePropagation && (!this.allowPropagation ||
         ((this.propagationX && this.directionX !== directionX) ||
          (this.propagationY && this.directionY !== directionY))))
      {
        event.preventDefault();
        event.stopPropagation();
      }

      this.stateUpdate.next(event.type);

      this.directionX = directionX;
      this.directionY = directionY;

      this.cdRef.detectChanges();
    }
  }

  public onTouchEvent(event: TouchEvent) {
    if (!this.disabled && this.autoPropagation) {
      if (event.type === 'touchmove') {
        this.interaction = true;

        const positionX = event.touches[0].clientX;
        const positionY = event.touches[0].clientY;

        const directionX = ((positionX - this.positionX) < 0) ? -1 : 1;
        const directionY = ((positionY - this.positionY) < 0) ? -1 : 1;

        if (this.usePropagation && (!this.allowPropagation ||
           ((this.propagationX && this.directionX !== directionX) ||
            (this.propagationY && this.directionY !== directionY))))
        {
          event.preventDefault();
          event.stopPropagation();
        }

        this.stateUpdate.next(event.type);

        this.directionX = directionX;
        this.directionY = directionY;

        this.positionX = positionX;
        this.positionY = positionY;

        this.cdRef.detectChanges();
      }
    }
  }

  public onScrollEvent(event: Event, state: string) {
    if (!this.disabled && (this.autoPropagation || this.scrollIndicators)) {
      this.stateUpdate.next(state);
    }
  }
}
