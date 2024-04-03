import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public newMessageWindowRequireCloseStream$: Subject<boolean> = new Subject<boolean>();
}
