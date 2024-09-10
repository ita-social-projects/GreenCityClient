import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/chat/service/socket/socket.service';

@Component({
  selector: 'app-user-component',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    this.socketService.connect();
  }
}
