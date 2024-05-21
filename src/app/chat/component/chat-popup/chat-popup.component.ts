import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Component, ComponentFactoryResolver, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CHAT_ICONS } from '../../chat-icons';
import { ChatsService } from '../../service/chats/chats.service';
import { NewMessageWindowComponent } from '../new-message-window/new-message-window.component';
import { ReferenceDirective } from '../../directive/reference/reference.directive';
import { CommonService } from '../../service/common/common.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SocketService } from '../../service/socket/socket.service';
import { MatDialog } from '@angular/material/dialog';
import { ChatModalComponent } from '../chat-modal/chat-modal.component';
import { JwtService } from '@global-service/jwt/jwt.service';

import { Role } from '@global-models/user/roles.model';

@Component({
  selector: 'app-chat-popup',
  templateUrl: './chat-popup.component.html',
  styleUrls: ['./chat-popup.component.scss']
})
export class ChatPopupComponent implements OnInit, OnDestroy {
  public chatIcons = CHAT_ICONS;
  public isOpen = false;

  private onDestroy$ = new Subject();
  private userId: number;
  public isAdmin: boolean;

  @Input() isSupportChat: boolean;

  @ViewChild(ReferenceDirective) elementRef: ReferenceDirective;
  private dialogConfig = {
    hasBackdrop: true,
    closeOnNavigation: true,
    disableClose: true,
    panelClass: 'custom-dialog-container',
    height: '80vh'
  };

  constructor(
    private chatsService: ChatsService,
    private commonService: CommonService,
    private factory: ComponentFactoryResolver,
    private socketService: SocketService,
    private dialog: MatDialog,
    private localeStorageService: LocalStorageService,
    private jwt: JwtService
  ) {}

  ngOnInit(): void {
    this.chatsService.isSupportChat$.next(this.isSupportChat);
    this.userId = this.localeStorageService.getUserId();
    this.socketService.connect();

    this.isAdmin = this.jwt.getUserRole() === Role.UBS_EMPLOYEE || this.jwt.getUserRole() === Role.ADMIN;
    if (this.isSupportChat && this.isAdmin) {
      this.chatsService.getAllSupportChats();
    }

    if (this.isSupportChat && !this.isAdmin) {
      this.chatsService.getLocationsChats(this.userId);
    }

    if (!this.isSupportChat) {
      this.chatsService.getAllUserChats(this.userId);
    }

    this.commonService.newMessageWindowRequireCloseStream$.pipe(takeUntil(this.onDestroy$)).subscribe(() => this.closeNewMessageWindow());
  }

  public openNewMessageWindow(isEmpty: boolean) {
    if (isEmpty) {
      this.chatsService.setCurrentChat(null);
    }
    const newMsgComponent = this.factory.resolveComponentFactory(NewMessageWindowComponent);
    this.elementRef.containerRef.clear();
    this.elementRef.containerRef.createComponent(newMsgComponent);
  }

  private closeNewMessageWindow() {
    this.elementRef.containerRef.clear();
  }

  public openChatModal() {
    this.commonService.newMessageWindowRequireCloseStream$.next(true);
    this.dialog.closeAll();
    this.dialog.open(ChatModalComponent, this.dialogConfig);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
