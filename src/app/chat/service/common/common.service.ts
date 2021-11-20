import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public newMessageWindowRequireCloseStream$: Subject<boolean> = new Subject<boolean>();

  constructor() {}
}
