import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ChatPopupComponent } from './component/chat-popup/chat-popup.component';
import { ChatsListComponent } from './component/chats-list/chats-list.component';
import { ChatsSearchPipe } from './pipe/chats-search/chats-search.pipe';
import { NewMessageWindowComponent } from './component/new-message-window/new-message-window.component';
import { ReferenceDirective } from './directive/reference/reference.directive';
import { ChatModalComponent } from './component/chat-modal/chat-modal.component';
import { CurrentChatComponent } from './component/current-chat/current-chat.component';
import { ChatComponent } from './component/chat/chat.component';
import { MessageFromDayPipe } from './pipe/message-from-day/message-from-day.pipe';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from '../ubs/ubs/ubs-order.module';

@NgModule({
  declarations: [
    ChatPopupComponent,
    ChatsListComponent,
    ChatsSearchPipe,
    NewMessageWindowComponent,
    ReferenceDirective,
    ChatModalComponent,
    CurrentChatComponent,
    ChatComponent,
    MessageFromDayPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    InfiniteScrollModule,
    PickerModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    })
  ],
  exports: [ChatPopupComponent],
  providers: [MatDialog]
})
export class ChatModule {}
