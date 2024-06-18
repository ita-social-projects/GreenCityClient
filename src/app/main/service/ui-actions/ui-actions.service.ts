import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiActionsService {
  stopScrollingSubject = new BehaviorSubject<boolean>(false);
}
