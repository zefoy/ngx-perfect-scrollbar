import resolve from 'rollup-plugin-node-resolve';

import sourcemaps from 'rollup-plugin-sourcemaps';

const pkg = require('../package.json');

const name = pkg.name.replace(/-([a-z])/g, (g) => {
  return g[1].toUpperCase();
});

const globals = {
  '@angular/animations': 'ng.animations',
  '@angular/common': 'ng.common',
  '@angular/core': 'ng.core',
  '@angular/forms': 'ng.forms',
  '@angular/http': 'ng.http',
  '@angular/router': 'ng.router',

  '@angular/platform-browser': 'ng.platformBrowser',
  '@angular/platform-server': 'ng.platformServer',

  'rxjs/BehaviorSubject': 'Rx',
  'rxjs/Observable': 'Rx',
  'rxjs/Observer': 'Rx',
  'rxjs/ReplaySubject': 'Rx',
  'rxjs/Scheduler': 'Rx',
  'rxjs/Subject': 'Rx',
  'rxjs/Subscriber': 'Rx',
  'rxjs/Subscription': 'Rx',

  'rxjs/observable/combineLatest': 'Rx.Observable',
  'rxjs/observable/forkJoin': 'Rx.Observable',
  'rxjs/observable/fromEvent': 'Rx.Observable',
  'rxjs/observable/merge': 'Rx.Observable',
  'rxjs/observable/of': 'Rx.Observable',
  'rxjs/observable/throw': 'Rx.Observable',

  'rxjs/operator/concatMap': 'Rx.Observable.prototype',
  'rxjs/operator/filter': 'Rx.Observable.prototype',
  'rxjs/operator/map': 'Rx.Observable.prototype',
  'rxjs/operator/share': 'Rx.Observable.prototype',

  'rxjs/add/observable/fromEvent': 'Rx.Observable',
  'rxjs/add/observable/interval': 'Rx.Observable',
  'rxjs/add/observable/merge': 'Rx.Observable',
  'rxjs/add/observable/of': 'Rx.Observable',

  'rxjs/add/operator/catch': 'Rx.Observable.prototype',
  'rxjs/add/operator/debounceTime': 'Rx.Observable.prototype',
  'rxjs/add/operator/distinctUntilChanged': 'Rx.Observable.prototype',
  'rxjs/add/operator/first': 'Rx.Observable.prototype',
  'rxjs/add/operator/map': 'Rx.Observable.prototype',
  'rxjs/add/operator/startWith': 'Rx.Observable.prototype',
  'rxjs/add/operator/switchMap': 'Rx.Observable.prototype',
  'rxjs/add/operator/throttleTime': 'Rx.Observable.prototype'
};

const external = Object.keys(globals);

export default {
  external: external,
  input: `${pkg.module}`,
  output: {
    file: `${pkg.main}`,
    format: 'umd',
    name: `zef.${name}`,
    globals: globals,
    sourcemap: true,
    exports: 'named'
  },
  plugins: [
    resolve(),
    sourcemaps()
  ]
}
