import { CommonModule } from '@angular/common';

import { NgModule, ModuleWithProviders, OpaqueToken, Optional, SkipSelf } from '@angular/core';

import { PerfectScrollbarComponent }   from './perfect-scrollbar.component';

import { PerfectScrollbarConfig, PerfectScrollbarConfigInterface } from './perfect-scrollbar.interfaces';

export const PERFECT_SCROLLBAR_CONFIG = new OpaqueToken('PERFECT_SCROLLBAR_CONFIG');

@NgModule({
    imports: [CommonModule],
    declarations: [PerfectScrollbarComponent],
    exports: [CommonModule, PerfectScrollbarComponent]
})
export class PerfectScrollbarModule {
  constructor (@Optional() @SkipSelf() parentModule: PerfectScrollbarModule) {
    if (parentModule) {
      throw new Error(`PerfectScrollbarModule is already loaded. 
        Import it in the AppModule only!`);
    }
  }

  static forRoot(config: PerfectScrollbarConfigInterface): ModuleWithProviders {
    return {
      ngModule: PerfectScrollbarModule,
      providers: [
				{
					provide: PERFECT_SCROLLBAR_CONFIG,
					useValue: config ? config : {}
				},
				{
					provide: PerfectScrollbarConfig,
			    useFactory: providePerfectScrollbarConfig,
					deps: [
						PERFECT_SCROLLBAR_CONFIG
					]
				}
			]
    };
  }
}

export function providePerfectScrollbarConfig(configInterface: PerfectScrollbarConfigInterface) {
	const config = new PerfectScrollbarConfig(configInterface);

  return config;
}
