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
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { JwtService } from '@global-service/jwt/jwt.service';

@Component({
  selector: 'app-chat-popup',
  templateUrl: './chat-popup.component.html',
  styleUrls: ['./chat-popup.component.scss']
})
export class ChatPopupComponent implements OnInit, OnDestroy {
  chatIcons = CHAT_ICONS;
  isOpen = false;

  private onDestroy$ = new Subject();
  private userId: number;
  private courierUBSName = 'UBS';
  isUbsAdmin: boolean;
  breakpoint = 575;
  isSupportChat: boolean;

  @Input() chatClass: string;

  @ViewChild(ReferenceDirective) elementRef: ReferenceDirective;
  private dialogConfig = {
    hasBackdrop: true,
    closeOnNavigation: true,
    disableClose: true,
    panelClass: ['custom-dialog-container', 'chat-dialog-container']
  };

  constructor(
    public chatsService: ChatsService,
    private commonService: CommonService,
    private factory: ComponentFactoryResolver,
    private socketService: SocketService,
    private dialog: MatDialog,
    private localStorageService: LocalStorageService,
    private jwt: JwtService
  ) {}

  ngOnInit(): void {
    this.localStorageService.userIdBehaviourSubject.pipe(takeUntil(this.onDestroy$)).subscribe((id) => {
      this.userId = id;
      this.isUbsAdmin = this.jwt.getUserRole() === 'ROLE_UBS_EMPLOYEE';
      if (id) {
        this.socketService.connect();
        this.chatsService.loadChats(this.userId, this.isUbsAdmin);
      } else {
        this.socketService.unsubscribeAll();
        this.chatsService.resetData();
        this.isOpen = false;
        this.commonService.newMessageWindowRequireCloseStream$.next(true);
      }
    });

    this.chatsService.isSupportChat$.pipe(takeUntil(this.onDestroy$)).subscribe((value) => {
      this.isSupportChat = value;
    });

    this.commonService.newMessageWindowRequireCloseStream$.pipe(takeUntil(this.onDestroy$)).subscribe(() => this.closeNewMessageWindow());
  }

  openAuthModalWindow(): void {
    this.dialog.open(AuthModalComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: ['custom-dialog-container'],
      data: {
        popUpName: 'sign-in'
      }
    });
  }

  handlePanelClick(): void {
    if (this.userId) {
      this.isOpen = !this.isOpen;
    } else {
      this.openAuthModalWindow();
    }
  }

  openNewMessageWindow(isEmpty: boolean) {
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

  openChatModal() {
    this.commonService.newMessageWindowRequireCloseStream$.next(true);
    this.dialog.closeAll();
    this.dialog.open(ChatModalComponent, this.dialogConfig);
  }

  hideChat(): void {
    this.commonService.isChatVisible$.next(false);
  }

  ngOnDestroy(): void {
    this.socketService.unsubscribeAll();
    this.chatsService.resetData();
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
