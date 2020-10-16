import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthModalServiceService {
  public authPopUpSubj = new ReplaySubject();

  constructor() { }

  public setAuthPopUp(popUpName: string): void {
    this.authPopUpSubj.next(popUpName);
  }
}
