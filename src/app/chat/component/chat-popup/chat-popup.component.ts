import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Component, ComponentFactoryResolver, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CHAT_ICONS } from '../../chat-icons';
import { ChatsService } from '../../service/chats/chats.service';
import { NewMessageWindowComponent } from '../new-message-window/new-message-window.component';
import { ReferenceDirective } from '../../directive/reference/reference.directive';
import { CommonService } from '../../service/common/common.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SocketService } from '../../service/socket/socket.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChatModalComponent } from '../chat-modal/chat-modal.component';

@Component({
  selector: 'app-chat-popup',
  templateUrl: './chat-popup.component.html',
  styleUrls: ['./chat-popup.component.scss']
})
export class ChatPopupComponent implements OnInit, OnDestroy {
  public chatIcons = CHAT_ICONS;
  private onDestroy$ = new Subject();
  private userId: number;

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
    public dialogRef: MatDialogRef<ChatPopupComponent>
  ) {}

  ngOnInit(): void {
    this.userId = this.localeStorageService.getUserId();
    this.socketService.connect();
    this.chatsService.getAllUserChats(this.userId);
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
    this.dialog.closeAll();
    this.dialog.open(ChatModalComponent, this.dialogConfig);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
