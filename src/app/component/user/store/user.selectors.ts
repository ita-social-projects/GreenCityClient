import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from './../../../store/app.reducers';

@Injectable()
export class UserSelectors {
  constructor(private store: Store<fromApp.AppState>) {}

  public userModule = this.store.select('userModule');
}
