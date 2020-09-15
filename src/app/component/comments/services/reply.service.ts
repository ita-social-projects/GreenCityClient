import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReplyService {
  public repliesList = [];
  public replySubscription = new Subject();

  constructor() { }
}
