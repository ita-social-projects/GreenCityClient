import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private messageSource = new BehaviorSubject('default message');
  userChoice = this.messageSource.asObservable();

  constructor() {
  }

  changeUserChoice(type: string) {
    this.messageSource.next(type);
  }
}
