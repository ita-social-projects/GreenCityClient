import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TriggerTableFetchService {
  private actionSource = new BehaviorSubject<void>(undefined);
  action$ = this.actionSource.asObservable();

  triggerRefetch() {
    this.actionSource.next();
  }
}
