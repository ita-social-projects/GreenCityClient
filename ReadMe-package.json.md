# **Package.json in GreenCity**

## _Part 1. General information_

### **name**

The name of the package. Important when you want to publish your package.

### **version**

Shows current version of the package. May be updated

### **scripts**

Configuration object where you may add keywords which will do some actions.

The script will run if you type:

 **npm run keyword**

In **GreenCity** project there are such scripts:

**ng** - shows information about Angular available commands.

**start** - runs a local server(by default at **localhost:4000**) where you may see what you did. Reruns after you do some changes in the code.

**build** - compiles the application into a /dist directory.

**test** - runs unit tests in application.

**lint** - runs linting tools which shows you code style mistakes.

**e2e** - runs a local server and then runs e2e tests using Protractor.

### **private**

If the field **&#39;private&#39;** is set to **&#39;true&#39;** in your **packacke.json** , the package will not be published.

### **dependencies**

The field which contains the set of pairs: package – it&#39;s version. To install a package and add it into dependencies type:

**npm i --save package-name**

### **devDependencies**

The field which contains the set of pairs: package – it&#39;s version. The difference between devDependencies and dependencies is that packages in devDependencies are used only during the development. To install a package and add it into devDependencies type:

**npm i --save-dev package-name**

**Source:** [https://docs.npmjs.com/files/package.json](https://docs.npmjs.com/files/package.json)

[https://angular.io/cli](https://angular.io/cli)

## _Part 2. Packages in GreenCity_

### **dependencies**

**@agm/core** - contains solutions for the Google Maps JavaScript Core API.

**@angular/animations** - contains functions to create and set animations.

**@angular/cdk** - Angular Material Component Development Kit.

**@angular/common** - implements fundamental Angular framework functionality, including directives and pipes, location services used in routing, HTTP services, localization support, and so on.

**@angular/compiler** - contains compiler files.

**@angular/core** - implements Angular&#39;s core functionality, low-level services, and utilities.

**@angular/fire** - the official Angular library for Firebase.

**@angular/forms** - implements Angular&#39;s forms functionality.

**@angular/material** - contains Angular Material files.

**@angular/platform-browser** – supports execution of Angular apps on different supported browsers.

**@angular/platform-browser-dynamic** -supports JIT compilation and execution of Angular apps on different supported browsers.

**@angular/router** - implements the Angular Router service , which enables navigation from one view to the next as users perform application tasks.

**@material/dialog** - contains Angular Material dialog component.

**@ng-bootstrap/ng-bootstrap** - Angular widgets built from the ground up using only Bootstrap 4 CSS with APIs designed for the Angular ecosystem. No dependencies on 3rd party JavaScript.

**@ng-select/ng-select** - contains Angular select widget built from Bootstrap.

**@ngrx/effects** - containseffects which are an RxJS powered side effect model for Store. Effects use streams to provide new sources of actions to reduce state based on external interactions such as network requests, web socket messages and time-based events.

**@ngrx/store** - store is RxJS powered state management for Angular applications, inspired by Redux. Store is a controlled state container designed to help write performant, consistent applications on top of Angular.

**@ngrx/store-devtools** - store Devtools provides developer tools and instrumentation for Store.

**@ngx-translate/core** - the internationalization (i18n) library for Angular.

**@ngx-translate/http-loader** - a loader for **ngx-translate** that loads translations using http.

**agm-direction** - additional directive for **@agm/core**.

**angular-bootstrap-md** - angular Bootstrap with Material Design package.

**angularx-social-login** - social login and authentication module for Angular 9 / 10. Supports authentication with Google, Facebook, and Amazon. Can be extended to other providers also.

**big-integer** - BigInteger.js is an arbitrary-length integer library for Javascript, allowing arithmetic operations on integers of unlimited size, notwithstanding memory and time limitations.

**bignumber.js** - BigNumber.js is a light javascript library for node.js and the browser. It supports arithmetic operations on Big Integers.

**bootstrap** - Bootstrap package which will add Bootstrap&#39;s styles to your project.

**chart.js** - package which will help to create charts.

**chartjs-plugin-labels** - Chart.js plugin to display labels on pie, doughnut and polar area chart.

**fileuploader** -file uploader component.

**firebase -** Firebase package.

**hammerjs** -package which will add touch gestures.

**i** - customizable inflections for Node.js.

**material-ui-bottom-sheet** - bottom sheets slide up from the bottom of the screen to reveal more content.

**nativescript-material-bottomsheet** - package which add using Material BottomSheets.

**ng-flash-messages** - it is an Angular flash message library with bootstrap styling and native angular animation.

**ng2-file-upload** - package for file uploading.

**ng2-search-filter** - Angular filter to make custom search.

**ng5-slider** - package for creating customized sliders.

**ngx-bootstrap** -package for integrating Bootstrap components into Angular.

**ngx-image-cropper** -package which will implement the image cropping.

**ngx-infinite-scroll** -package which will implement the infinity scroll.

**ngx-page-scroll** - package which will implement animated scrolling functionality.

**ngx-page-scroll-core** - core package for implementing animated scrolling functionality.

**ngx-pagination** - package which will implement the pagination.

**ngx-swiper-wrapper** - package which is wrapper for Swiper (modern slider) library.

**rxjs** -package which is necessary to use the Rxjs library.

**save** - simple CRUD based persistence abstraction for storing objects to any backend data store.

**tslib** - This is a runtime library for **TypeScript** that contains all of the TypeScript helper functions.

**zone.js** - implements **Zones** (execution context that persists across async tasks) for JavaScript.

### **devDependencies**

**@angular-devkit/build-angular** - Angular Webpack Build Facade.

**@angular/cli** - Angular command line interface.

**@angular/compiler-cli** - compiler for Angular command line interface.

**@angular/language-service** - the Angular Language Service provides code editors with a way to get completions, errors, hints, and navigation inside Angular templates.

**@types/googlemaps** - types for GoogleMaps.

**@types/jasmine** - types for Jasmine.

**@types/jasminewd2** - package which contains the definitions for jasminewd2.

**@types/node** - package which contains the definitions for Node.js.

**codelyzer** - a set of **tslint** rules for static code analysis of Angular TypeScript projects.

**jasmine-core** -package which contains Jasmine.

**jasmine-spec-reporter** - real time console spec reporter for Jasmine testing framework.

**karma** - package which contains Karma.

**karma-chrome-launcher** - launcher for Google Chrome, Google Chrome Canary and Google Chromium.

**karma-coverage-istanbul-reporter** - a karma reporter that uses the latest istanbul 1.x APIs (with full sourcemap support) to report coverage.

**karma-jasmine** – adapter for the Karma and Jasmine.

**karma-jasmine-html-reporter** - reporter that dynamically shows tests results at debug.html page.

**protractor** -provides end-to-end testing in Angular.

**ts-node** - TypeScript execution and REPL ( **Read-eval-print loop** ) for node.js, with source map support.

**tslint** -provides TypeScript linter.

**typescript** -provides TypeScript in the project.

**Source:** [https://angular.io/](https://angular.io/)

[https://ngrx.io/](https://ngrx.io/)

[https://www.npmjs.com/](https://www.npmjs.com/)

## _Part 3. Versions in package.json_

Patch releases: **1.0** or **1.0.x** or **~1.0.4** (for example changes **1.0.2** to **1.0.3** )

Minor releases: **1** or **1.x** or **^1.0.4** (for example changes **1.0.2** to **1.1.2** )

Major releases: \* or **x** (for example changes **1** to **2** )

**Source:** [https://docs.npmjs.com/about-semantic-versioning](https://docs.npmjs.com/about-semantic-versioning)
