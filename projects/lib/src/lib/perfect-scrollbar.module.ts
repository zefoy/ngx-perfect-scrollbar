import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfectScrollbarComponent } from './perfect-scrollbar.component';
import { PerfectScrollbarDirective } from './perfect-scrollbar.directive';

@NgModule({
    imports: [CommonModule],
    declarations: [PerfectScrollbarComponent, PerfectScrollbarDirective],
    exports: [CommonModule, PerfectScrollbarComponent, PerfectScrollbarDirective]
})
export class PerfectScrollbarModule {
}
