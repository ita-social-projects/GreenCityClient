// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { registerLocaleData } from '@angular/common';
import usLocale from '@angular/common/locales/en';
import ukLocale from '@angular/common/locales/uk';

// Register locale data for testing
registerLocaleData(usLocale, 'en-GB');
registerLocaleData(ukLocale, 'uk-UA');

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
  teardown: { destroyAfterEach: false }
});
