import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchClickService {
  emitter: EventEmitter<boolean> = new EventEmitter();

  public signal() {
    this.emitter.emit(true);
  }

  constructor() { }
}
