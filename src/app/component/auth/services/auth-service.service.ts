import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

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
