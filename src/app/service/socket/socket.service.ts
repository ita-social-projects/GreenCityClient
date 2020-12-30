import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { Stomp, StompSubscription } from '@stomp/stompjs';
import { SocketClientState } from './socket-state.enum'
import { filter, first, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {
  
  private state: BehaviorSubject<SocketClientState>;
  private webSocket: any;
  stompClient: any;
  coments;

  constructor() {
    this.webSocket = Stomp.over(() => new SockJS('https://greencity.azurewebsites.net/socket/'));
    this.state = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
    this.webSocket.connect({}, () => {
      this.state.next(SocketClientState.CONNECTED);
    });
  }

  public connect (): Observable<any> {
    return new Observable(observer => {
      this.state.pipe(filter(state => state === SocketClientState.CONNECTED)).subscribe(() => {
        observer.next(this.webSocket);
      });
    });
  }

  onMessage(what: string): Observable<any> {
    return this.connect()
      .pipe(
        first(),
        switchMap(client => {
          return new Observable<any>(observer => {
            const subscription: StompSubscription = client.subscribe(what, data => {
              observer.next(data);
            });
            return () => client.unsubscribe(subscription.id);
          });
    }));
  }

  send(what, data): void {
    this.connect()
      .pipe(first())
      .subscribe(client => client.send(what, data));
  }

  ngOnDestroy() {
    this.connect().pipe(first()).subscribe(client => client.disconnect(null));
  }
}
