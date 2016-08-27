import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders, OpaqueToken } from '@angular/core';

import { PerfectScrollbarComponent }   from './perfect-scrollbar.component';

import { PerfectScrollbarConfig, PerfectScrollbarConfigInterface } from './perfect-scrollbar.config';

export const PERFECT_SCROLLBAR_CONFIG = new OpaqueToken('PERFECT_SCROLLBAR_CONFIG');

@NgModule({
    imports: [BrowserModule],
    declarations: [PerfectScrollbarComponent],
    exports: [BrowserModule, PerfectScrollbarComponent]
})
export class PerfectScrollbarModule {
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
