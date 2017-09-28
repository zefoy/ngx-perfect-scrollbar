# Angular Perfect Scrollbar

<a href="https://badge.fury.io/js/ngx-perfect-scrollbar"><img src="https://badge.fury.io/js/ngx-perfect-scrollbar.svg" align="right" alt="npm version" height="18"></a>

This is an Angular wrapper library for the [Perfect Scrollbar](https://noraesae.github.io/perfect-scrollbar/).

See a live example application <a href="https://zefoy.github.io/ngx-perfect-scrollbar/">here</a>.

### Library building

```bash
npm install
npm run build
npm run inline
```

### Library development

```bash
npm link
cd example
npm link ngx-perfect-scrollbar
```

### Running the example

```bash
cd example
npm install
npm start

(or 'npm run start:sjs' for using SystemJS)
```
### Installing and usage

```bash
npm install ngx-perfect-scrollbar --save
```

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

##### Use it in your HTML template (with custom configuration):

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

[disabled]              // Disables the perfect scrollbar initialization.

[usePSClass]            // Use ps class (needed by the ps theme styles).

[autoPropagation]       // Automatic swipe and wheel propagation control.
[scrollIndicators]      // Enable fading edges scroll indicators showing.

(<ps-event-name>)       // All perfect scrollbar events work as bindings.
```

**DIRECTIVE USAGE**

When using only the directive you need to provide your own theming or import the default theme:

```css
/* From the perfect-scrollbar npm package */
@import '~perfect-scrollbar/dist/css/perfect-scrollbar.min.css';

/* OR from the CDN if you are not bundling the styles */
@import 'https://cdnjs.cloudflare.com/ajax/libs/jquery.perfect-scrollbar/0.7.0/css/perfect-scrollbar.min.css';
```

Perfect scrollbar directive should be used with div elements and can take optional custom configuration:

```html
<div [perfect-scrollbar]="config"></div>
```

```javascript
[perfect-scrollbar]     // Can be used to provide optional custom config.

[disabled]              // Disables the perfect scrollbar initialization.

[usePSClass]            // Use ps class (needed by the ps theme styles).
[psPosStyle]            // Position style (controls scrollbar placement).

(<ps-event-name>)       // All perfect scrollbar events work as bindings.
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

For more detailed documentation with all the supported events / options see the [Perfect Scrollbar documentation](https://github.com/noraesae/perfect-scrollbar/).

##### Available control / helper functions (provided by the directive):

```javascript
update()                        // Updates the scrollbar size and position.
geometry(property)              // Returns the geometry for specified property.
scrollable(direction)           // Checks if the given direction is scrollable.
                                // Direction can be: 'any','both','x','y'

scrollTo(x, y, speed)           // Animate scroll to given x,y coordinates.
scrollToY(position, speed)      // Animate scroll to given vertical position.
scrollToX(position, speed)      // Animate scroll to given horizontal position.
scrollToTop(offset, speed)      // Animate scroll to given offset from the top.
scrollToLeft(offset, speed)     // Animate scroll to given offset from the left.
scrollToRight(offset, speed)    // Animate scroll to given offset from the right.
scrollToBottom(offset, speed)   // Animate scroll to given offset from the bottom.
```

Above functions can be accessed through the directive reference (available as directiveRef in the component).
