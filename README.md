# Angular 2 Perfect Scrollbar

<a href="https://badge.fury.io/js/angular2-perfect-scrollbar"><img src="https://badge.fury.io/js/angular2-perfect-scrollbar.svg" align="right" alt="npm version" height="18"></a>

This is an Angular 2 wrapper library for [perfect-scrollbar](https://noraesae.github.io/perfect-scrollbar/).

See a live example application <a href="https://zefoy.github.io/angular2-perfect-scrollbar/">here</a>.

### Building the library

    npm install
    npm run build

### Running the example

    cd example
    npm install
    npm start

### Installing and usage

    npm install angular2-perfect-scrollbar --save-dev

##### Load the module for your app (with global configuration):

```javascript
import { PerfectScrollbarModule } from 'angular2-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'angular2-perfect-scrollbar';

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  ...
  imports: [
    ...
    PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG)
  ]
})
```

##### Use it in your html template (with custom configuration):

Simply replace the element that would ordinarily be passed to `Ps.initialize` with the perfect-scollbar component.

```html
<perfect-scrollbar class="container" [config]="config">
  <div class="content">Scrollable content</div>
</perfect-scrollbar>
```

```javascript
[config]                // Custom config to override the global defaults.

[runInsideAngular]      // Run PS initialization inside the angular zone.
```

##### Available configuration options (custom / global configuration):

```javascript
wheelSpeed              // Scroll speed for the mousewheel event (Default: 1).
wheelPropagation        // Propagate wheel events at the end (Default: false).
swipePropagation        // Propagate swipe events at the end (Default: true).
minScrollbarLength      // Minimum size for the scrollbar (Default: null).
maxScrollbarLength      // Maximum size for the scrollbar (Default: null).
useBothWheelAxes        // Always use the both wheel axes (Default: false).
suppressScrollX         // Disable X axis in all situations (Default: false).
suppressScrollY         // Disable Y axis ni all situations (Default: false).
scrollXMarginOffset     // Offset before enabling the X scroller (Default: 0).
scrollYMarginOffset     // Offset before enabling the Y scroller (Default: 0).
stopPropagationOnClick  // Stop the propagation of click event (Default: true).
```

For more detailed documentation with all the supported options see [perfect-scrollbar documentation](https://github.com/noraesae/perfect-scrollbar/).
