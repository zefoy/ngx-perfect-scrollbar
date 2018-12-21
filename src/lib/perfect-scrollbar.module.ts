import { NgModule, ModuleWithProviders } from '@angular/core';

import { CommonModule } from '@angular/common';

import { PerfectScrollbarComponent } from './perfect-scrollbar.component';
import { PerfectScrollbarDirective } from './perfect-scrollbar.directive';
import { PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from './perfect-scrollbar.interfaces'

@NgModule({
    imports: [CommonModule],
    declarations: [PerfectScrollbarComponent, PerfectScrollbarDirective],
    exports: [CommonModule, PerfectScrollbarComponent, PerfectScrollbarDirective]
})
export class PerfectScrollbarModule {
    static forRoot(config?: PerfectScrollbarConfigInterface): ModuleWithProviders {
        return {
            ngModule: PerfectScrollbarModule,
            providers: [
                {
                    provide: PERFECT_SCROLLBAR_CONFIG,
                    useValue: config
                }
            ]
        };
    }
}
