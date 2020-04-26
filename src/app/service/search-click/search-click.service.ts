import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchClickService {
  public openSearchEmitter: EventEmitter<boolean> = new EventEmitter();

  public signal() {
    this.openSearchEmitter.emit(true);
  }

  constructor() { }
}
