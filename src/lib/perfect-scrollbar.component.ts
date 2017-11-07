import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { Component, ViewEncapsulation,
  OnInit, OnDestroy, DoCheck, Input, Output,
  ViewChild, EventEmitter, HostBinding, HostListener,
  ElementRef, ChangeDetectorRef } from '@angular/core';

import { PerfectScrollbarDirective } from './perfect-scrollbar.directive';
import { PerfectScrollbarConfigInterface } from './perfect-scrollbar.interfaces';

@Component({
  selector: 'perfect-scrollbar',
  templateUrl: './lib/perfect-scrollbar.component.html',
  styleUrls: [ './lib/perfect-scrollbar.component.css' ],
  encapsulation: ViewEncapsulation.None
})
export class PerfectScrollbarComponent implements OnInit, OnDestroy, DoCheck {
  public states: any = {};
  public notify: boolean = null;

  public userInteraction: boolean = false;
  public allowPropagation: boolean = false;

  private cancelEvent: Event = null;

  private timeoutState: number = null;
  private timeoutScroll: number = null;

  private usePropagationX: boolean = false;
  private usePropagationY: boolean = false;

  private statesSub: Subscription = null;
  private statesUpdate: Subject<string> = new Subject();

  private activeSub: Subscription = null;
  private activeUpdate: Subject<boolean> = new Subject();

  @Input() disabled: boolean = false;

  @Input() usePSClass: boolean = true;

  @HostBinding('class.ps-show-limits')
  @Input() autoPropagation: boolean = false;

  @HostBinding('class.ps-show-active')
  @Input() scrollIndicators: boolean = false;

  @Input() config: PerfectScrollbarConfigInterface;

  @ViewChild(PerfectScrollbarDirective) directiveRef: PerfectScrollbarDirective;

  @HostListener('document:touchstart', ['$event']) onGeneratedEvent(event: any) {
    // Stop the generated event from reaching window for PS to work correctly
    if (event['psGenerated']) {
      event.stopPropagation();
    }
  }

  constructor(private cdRef: ChangeDetectorRef, private elementRef: ElementRef) {}

  ngOnInit() {
    this.activeSub = this.activeUpdate
      .distinctUntilChanged()
      .subscribe((active: boolean) => {
        this.allowPropagation = active;
      });

    this.statesSub = this.statesUpdate
      .distinctUntilChanged()
      .subscribe((state: string) => {
        window.clearTimeout(this.timeoutState);

        if (state !== 'x' && state !== 'y') {
          this.notify = true;

          this.states[state] = true;

          if (state === 'top') {
            this.states.bottom = false;
          } else if (state === 'bottom') {
            this.states.top = false;
          } else if (state === 'left') {
            this.states.rights = false;
          } else if (state === 'rights') {
            this.states.left = false;
          }

          this.timeoutState = window.setTimeout(() => {
            this.notify = false;

            if (this.autoPropagation && this.userInteraction &&
               ((!this.usePropagationX && (this.states.left || this.states.right)) ||
               (!this.usePropagationY && (this.states.top || this.states.bottom))))
            {
              this.allowPropagation = true;
            }

            this.cdRef.markForCheck();
          }, 300);
        } else {
          this.notify = false;

          if (state === 'x') {
            this.states.left = false;
            this.states.right = false;
          } else if (state === 'y') {
            this.states.top = false;
            this.states.bottom = false;
          }

          this.userInteraction = true;

          if (this.autoPropagation &&
            (!this.usePropagationX || !this.usePropagationY))
          {
            this.allowPropagation = false;

            if (this.cancelEvent) {
              this.elementRef.nativeElement.dispatchEvent(this.cancelEvent);

              this.cancelEvent = null;
            }
          } else if (this.scrollIndicators) {
            this.notify = true;

            this.timeoutState = window.setTimeout(() => {
              this.notify = false;

              this.cdRef.markForCheck();
            }, 300);
          }
        }

        this.cdRef.markForCheck();
        this.cdRef.detectChanges();
      });
  }

  ngOnDestroy() {
    if (this.activeSub) {
      this.activeSub.unsubscribe();
    }

    if (this.statesSub) {
      this.statesSub.unsubscribe();
    }

    if (this.timeoutState) {
      window.clearTimeout(this.timeoutState);
    }

    if (this.timeoutScroll) {
      window.clearTimeout(this.timeoutScroll);
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

  public getConfig(): PerfectScrollbarConfigInterface {
    const config = this.config || {};

    if (this.autoPropagation) {
      config.swipePropagation = true;
      config.wheelPropagation = true;
    }

    return config;
  }

  public onTouchEnd(event: Event = null) {
    if (!this.disabled && this.autoPropagation &&
       (!this.usePropagationX || !this.usePropagationY))
    {
      this.cancelEvent = null;

      this.allowPropagation = false;
    }
  }

  public onTouchMove(event: Event = null) {
    if (!this.disabled && this.autoPropagation && !this.allowPropagation) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  public onTouchStart(event: Event = null) {
    if (!this.disabled && this.autoPropagation) {
      this.userInteraction = true;

      if (this.allowPropagation) {
        // PS stops the touchmove event so lets re-emit it here
        if (this.elementRef.nativeElement) {
          const newEvent = new MouseEvent('touchstart', event);
          this.cancelEvent = new MouseEvent('touchmove', event);

          newEvent['psGenerated'] = this.cancelEvent['psGenerated'] = true;
          newEvent['touches'] = this.cancelEvent['touches'] = event['touches'];
          newEvent['targetTouches'] = this.cancelEvent['targetTouches'] = event['targetTouches'];

          this.elementRef.nativeElement.dispatchEvent(newEvent);
        }
      }

      this.cdRef.detectChanges();
    }
  }

  public onWheelEvent(event: Event = null) {
    if (!this.disabled && this.autoPropagation) {
      this.userInteraction = true;

      if (!this.allowPropagation) {
        event.preventDefault();
        event.stopPropagation();
      } else if (!this.usePropagationX || !this.usePropagationY) {
        this.allowPropagation = false;
      }

      this.cdRef.detectChanges();
    }
  }

  public onScrollEvent(event: Event = null, state: string) {
    if (!this.disabled && (this.autoPropagation || this.scrollIndicators) &&
       (!event || event.currentTarget === event.target))
    {
      this.statesUpdate.next(state);
    }
  }
}
