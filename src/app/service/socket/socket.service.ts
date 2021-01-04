import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, observable, of } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { Stomp, StompSubscription } from '@stomp/stompjs';
import { SocketClientState } from './socket-state.enum'
import { filter, first, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  
  private state: BehaviorSubject<SocketClientState>;
  private webSocket: any;
  stompClient: any;
  coments;

  constructor() {
    // this.webSocket.connect({}, () => {
    //   this.state.next(SocketClientState.CONNECTED);
    // });
    this.state = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
    this.webSocket = Stomp.over(() => new SockJS('https://greencity.azurewebsites.net/socket'));
    this.webSocket.connect({}, () => {
      this.state.next(SocketClientState.CONNECTED);
    });
  }

  connect(): Observable<any> {
    return new Observable(observer => {
      this.state.pipe(filter(state => state === SocketClientState.CONNECTED)).subscribe(() => {
        observer.next(this.webSocket);
      });
    });
  }

  // public onConnected(comment) {
  //   console.log('onConnected', comment)
  //   this.webSocket
  //     .subscribe(`/topic/comment`, this.onMessageReceived);
  // public connect(): Observable<any> {
    // return new Observable(observer => {
    //   this.state.pipe(filter(state => state === SocketClientState.CONNECTED)).subscribe(() => {
    //     observer.next(this.webSocket);
    //   });
    // });
  // }

  // onMessageReceived(msg){
  //   console.log(JSON.parse(msg.body));
  // }

  // onMessage(what: string): Observable<any> {
  //   return this.connect()
  //     .pipe(
  //       first(),
  //       switchMap(client => {
  //         return new Observable<any>(observer => {
  //           const subscription: StompSubscription = client.subscribe(what, data => {
  //             observer.next(data);
  //           });
  //           return () => client.unsubscribe(subscription.id);
  //         });
  //   }));
  // }

  // sesendMessage(link, comment): void {
  //   this.webSocket.send(link, {}, JSON.stringify({
  //     id: comment.id,
  //     likes: 1
  //   }));
  // }

  // ngOnDestroy() {
  //   this.connect().pipe(first()).subscribe(client => client.disconnect(null));
  // }
}
