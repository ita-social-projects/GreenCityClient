# GreenCityClient [![HitCount](http://hits.dwyl.com/ita-social-projects/GreenCityClient.svg)](http://hits.dwyl.com/ita-social-projects/GreenCityClient)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running unit tests with code coverage

Run `ng test --codeCoverage` to execute the unit tests via [Karma](https://karma-runner.github.io) and to display test coverage via [karma-coverage-istanbul-reporter](https://github.com/mattlewis92/karma-coverage-istanbul-reporter).
After passing all tests run `cd coverage/GreenCityClient/ && start index.html` for Windows or `cd coverage/GreenCityClient/ && open index.html` for MacOS

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## How to connect with front-end if some issues

1. Run ng version and npm -v in the console. You must have the following versions to work correctly:
   Angular CLI: 9.1.15
   Node: 14.20.1
   npm: 6.14.15

In most cases reinstalling the Node is enough.
Use this link to install Node v.14.20.1 (https://nodejs.org/en/blog/release/v14.20.1) before that, uninstall your installed version.

If the problem persists, try to install npm:6.14.15 at this link (https://www.npmjs.com/package/npm/v/6.14.15).

You should install Angular CLI 9.1.15 writting this in console: npm install -g @angular/cli@9.1.15

## Running json-server

1.npm i -g json-server (https://www.npmjs.com/package/json-server); 2. in first thred use command : json-server src\assets\all-json\eco-news.json;
3.in second thred use command: ng serve;

## Project structure

1.  /e2e/ directory:
    e2e stands for end-to-end and it refers to e2e tests of the website. It contains testing scenarios (scripts) which simulate user behavior. We can simulate a user who visits a website, signs in, navigates to another site, fills the form and logs out.

2.  /node_modules/
    All 3rd party libraries are installed into this folder when you run npm install. Those libraries are bundled into our application. What is important to know is that you shouldn't include this folder when deploying your application to production or committing to the git repository. If you move your project to a new location you should skip this folder and run npm install in a new location.

3.  /src/
    This is where we keep our application source code.

    - /app/
      This folder contains templates, styles, images, angular components and anything else In angular project inside src folder. Any files outside of this folder are meant to support building your app.

          /app/component/
              This folder contains all components

          /app/component/shared/components/
              This folder contains all shared components, which we use

          /app/component/layout/
              The layout directory contains one or more components which act as a layout or are parts of a layout such as a Header, Nav, Footer

          /app/component/directives/
              This folder contains all custom directives

          /app/model/
              This folder contains all models(classes, interfaces)

          /app/pipe/
              This folder contains all custom pipes

          /app/service/
              This folder contains all services

          /app/app-routing.module.ts
              This file contains class AppRoutingModule and all routes of the main page

    - /assets/
      This folder contains static assets for our app like images, icons, styles.

    - /environments/
      This folder contains two files, each for different environments. You will use this file to store environment specific configuration like database credentials or server addresses. By default there are two files, one for production and on for development.

    - favicon.ico
      The favicon of our app.

    - index.html
      This is is a very simple HTML file. If you open it you will note that there are no references to any stylesheet (CSS) nor JS files. This is because all dependencies are injected during the build process.

    - main.ts
      This is the starting point for our app. If you ever coded in languages like Java or C you can compare it to a main() method. If you haven't, then just remember that our application starts to execute from this place. This is where we are bootstrapping our first and only module — AppModule.

    - polyfils.ts
      Polyfils files are used for the compiler to compile our Typescript to specific JavaScript methods which can be parsed by different browsers.

    - styles.scss
      This is global stylesheet file that is by default, included to our project. Keep in mind that each component has its own style component which applies styles only within the scope of given component.

    - test.ts
      This is a configuration file for Karma. Karma is a testing tool shipped along with Angular, we will cover it one of the later lessons.

4.  .gitignore
    This file instructs git which files should be ignored when working with git repository.

5.  karma.conf.js
    Another configuration file for Karma. We will cover that in the future.

6.  package.json
    This file is mandatory for every npm project. It contains basic information regarding our project (name, description, license etc.) commands which can be used, dependencies — those are packages required by our application to work correctly, and devDepndencies — again a list of packages which are required for our application however only during the development phase. I.e. we need Angular CLI only during development to build a final package however on production we don't need it anymore.

7.  README.md
    File containing a description of our project. All the information which we would like to provide our userswith before they start using our app.

8.  tsconfig.json
    A bunch of compiler settings. Based on these settings, it will compile code to JS code which that browser can understand.

9.  tsconfig.{app|spec}.json
    TypeScript compiler configuration for the Angular app (tsconfig.app.json) and for the unit tests (tsconfig.spec.json).

10. tslint.json
    TSlint is a useful static analysis tool that checks our TypeScript code for readability, maintainability, and functionality errors. This file contains its configuration. We will see how it works in a future lesson.

## Modules:

    app.module.ts - The root module of the application
    eco-news.module.ts - Eco News module
    about.module.ts
    auth.module.ts
    comments.module.ts
    core.module.ts
    modal.module.ts
    eco-news-routing.module.ts
    home.module.ts
    layout.module.ts
    map-routing.module.ts
    shared.module.ts
    user-routing.module.ts

## Services:

    language.service.ts
    change-password.service.ts
    profile.service.ts
    comments.service.ts
    create-eco-news.service.ts
    search.service.ts
    place.service.ts
    favorite-place.service.ts
    news.service.ts
    interceptor.service.ts
    edit-profile.service.ts
    eco-news.service.ts
    local-storage.service.ts
    all-habits.service.ts
    title-and-meta-tags.service.ts
    user.service.ts
    ui-actions.service.ts
    auth-page-guard.service.ts
    filter-place.service.ts
    feedback.service.ts
    user-own-sign-up.service.ts
    user-own-sign-in.service.ts
    user-own-auth.service.ts
    restore-password.service.ts
    language.service.ts
    modal.service.ts
    confirmation-dialog-service.service.ts
    weekDaysUtils.service.ts
    subscription.service.ts
    specification.service.ts
    home-page-guard.service.ts
    jwt.service.ts
    habit-statistic.service.ts
    habit-fact.service.ts
    comment.service.ts
    category.service.ts
    google-sign-in.service.ts
    advice.service.ts
    achievement.service.ts
