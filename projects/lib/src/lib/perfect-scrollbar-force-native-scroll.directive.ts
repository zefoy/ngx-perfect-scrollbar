import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[forceNativeScrolling]'
})
export class ForceNativeScrollDirective {

  constructor(private renderer: Renderer2, el: ElementRef) {
    ['ps__child', 'ps__child--consume'].forEach((className) => {
      this.renderer.addClass(el?.nativeElement, className);
    });
  }
}
