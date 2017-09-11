import { CommonModule } from '@angular/common';

import { NgModule, ModuleWithProviders, InjectionToken, Optional, SkipSelf, Inject } from '@angular/core';

import { PerfectScrollbarComponent } from './perfect-scrollbar.component';
import { PerfectScrollbarDirective } from './perfect-scrollbar.directive';

import { PerfectScrollbarConfig, PerfectScrollbarConfigInterface } from './perfect-scrollbar.interfaces';

export const PERFECT_SCROLLBAR_GUARD = new InjectionToken('PERFECT_SCROLLBAR_GUARD');
export const PERFECT_SCROLLBAR_CONFIG = new InjectionToken('PERFECT_SCROLLBAR_CONFIG');

@NgModule({
    imports: [CommonModule],
    declarations: [PerfectScrollbarComponent, PerfectScrollbarDirective],
    exports: [CommonModule, PerfectScrollbarComponent, PerfectScrollbarDirective]
})
export class PerfectScrollbarModule {
  constructor (@Optional() @Inject(PERFECT_SCROLLBAR_GUARD) guard: any) {}

  static forRoot(config?: PerfectScrollbarConfigInterface): ModuleWithProviders {
    return {
      ngModule: PerfectScrollbarModule,
      providers: [
        {
          provide: PERFECT_SCROLLBAR_GUARD,
          useFactory: provideForRootGuard,
          deps: [
            [
              PerfectScrollbarConfig,
              new Optional(),
              new SkipSelf()
            ]
          ]
        },
        {
          provide: PERFECT_SCROLLBAR_CONFIG,
          useValue: config ? config : {}
        },
        {
          provide: PerfectScrollbarConfig,
          useFactory: provideDefaultConfig,
          deps: [
            PERFECT_SCROLLBAR_CONFIG
          ]
        }
      ]
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: PerfectScrollbarModule
    };
  }
}

export function provideForRootGuard(config: PerfectScrollbarConfig): any {
  if (config) {
    throw new Error(`
      Application called PerfectScrollbarModule.forRoot() twice.
      For submodules use PerfectScrollbarModule.forChild() instead.
    `);
  }

  return 'guarded';
}

export function provideDefaultConfig(config: PerfectScrollbarConfigInterface): PerfectScrollbarConfig {
  return new PerfectScrollbarConfig(config);
}
