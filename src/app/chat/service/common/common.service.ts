import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  newMessageWindowRequireCloseStream$: Subject<boolean> = new Subject<boolean>();
  isChatVisible$ = new BehaviorSubject<boolean>(false);
}
