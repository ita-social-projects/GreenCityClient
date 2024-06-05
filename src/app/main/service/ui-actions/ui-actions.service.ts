import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiActionsService {
  public stopScrollingSubject = new BehaviorSubject<boolean>(false);
}
