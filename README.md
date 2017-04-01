# Angular Perfect Scrollbar

<a href="https://badge.fury.io/js/ngx-perfect-scrollbar"><img src="https://badge.fury.io/js/ngx-perfect-scrollbar.svg" align="right" alt="npm version" height="18"></a>

This is an Angular wrapper library for the [Perfect Scrollbar](https://noraesae.github.io/perfect-scrollbar/).

See a live example application <a href="https://zefoy.github.io/ngx-perfect-scrollbar/">here</a>.

### Library building

    npm install
    npm run build
    npm run inline

### Library development

    npm link
    cd example
    npm link ngx-perfect-scrollbar

### Running the example

    cd example
    npm install
    npm start

    (or 'npm run start:sjs' for using systemjs)

### Installing and usage

    npm install ngx-perfect-scrollbar --save-dev

##### Load the module for your app (with global configuration):

```javascript
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

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

This library provides two ways to create a Perfect Scrollbar element, a component and a directive.

**COMPONENT USAGE**

Simply replace the element that would ordinarily be passed to `Ps.initialize` with the perfect-scollbar component.

```html
<perfect-scrollbar class="container" [config]="config">
  <div class="content">Scrollable content</div>
</perfect-scrollbar>
```

```javascript
[config]                // Custom config to override the global defaults.
```

**DIRECTIVE USAGE**

When using only the directive you need to provide your own theming or import the default theme:

```css
@import 'https://cdnjs.cloudflare.com/ajax/libs/jquery.perfect-scrollbar/0.6.15/css/perfect-scrollbar.min.css';
```

Perfect scrollbar directive should be used with div elements and can take optional custom configuration:

```html
<div [perfect-scrollbar]="config"></div>
```

```javascript
[perfect-scrollbar]     // Can be used to provide optional custom config.
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

For more detailed documentation with all the supported options see [Perfect Scrollbar documentation](https://github.com/noraesae/perfect-scrollbar/).
