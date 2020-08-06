import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import * as fromApp from './../../../store/app.reducers';

@Injectable()
export class EcoNewsSelectors {
  constructor(private store: Store<fromApp.AppState>) {}

  public ecoNewsModule$ = this.store.select('ecoNewsModule');
}
