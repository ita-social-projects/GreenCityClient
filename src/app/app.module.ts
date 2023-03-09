import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy, LOCATION_INITIALIZED } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { MainModule } from './main/main.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UbsModule } from './ubs/ubs.module';
import { appReducers } from './store/reducers/app.reducer';
import { EmployeesEffects } from './store/effects/employee.effects';
import { LocationsEffects } from './store/effects/tariff.effects';
import { BigOrderTableEffects } from './store/effects/bigOrderTable.effects';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LanguageService } from './main/i18n/language.service';
import { NewsEffects } from './store/effects/ecoNews.effects';
import { EventsEffects } from './store/effects/ecoEvents.effects';
import { UbsRoutingModule } from './ubs/ubs/ubs-routing.module';

export function appInitializerFactory(translate: TranslateService, injector: Injector, languageService: LanguageService) {
  return () =>
    new Promise<any>((resolve: any) => {
      const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
      locationInitialized.then(() => {
        languageService.setDefaultLanguage();
        const langToSet = languageService.getCurrentLanguage();

        translate.use(langToSet).subscribe(
          () => {
            console.log(`Successfully initialized '${langToSet}' language.'`);
          },
          (err) => {
            console.error(`Problem with '${langToSet}' language initialization.'`);
          },
          () => {
            resolve(null);
          }
        );
      });
    });
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MainModule,
    UbsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: LoaderFactory,
        deps: [HttpClient]
      }
    }),
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot([EmployeesEffects, LocationsEffects, BigOrderTableEffects, NewsEffects, EventsEffects]),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    })
  ],
  providers: [
    // we use HashLocationStrategy because
    // so it is to avoid collisions in two types of routes (BE and FE)
    // also this is to stylistically separate them from each other
    // Also some articles write that this is a well-known mistake of the angular SPA and gh-pages
    // and I didn't find how to solve it
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, Injector, LanguageService],
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  exports: [TranslateModule]
})
export class AppModule {}

export function LoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}
