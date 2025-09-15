import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@environment/environment';
import { Observable } from 'rxjs';
import { PaginatedResponse, ChatDto, MessageDto, ClientInfoRecord } from '../model/chat-page.interface';

@Injectable({ providedIn: 'root' })
export class ChatApiService {
  private readonly baseUrl = `${environment.ubsAdmin.backendUbsAdminLink}/telegram`;

  constructor(private readonly http: HttpClient) {}

  private authHeaders(): HttpHeaders | null {
    const token = localStorage.getItem('accessToken');
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : null;
  }

  getChats(page: number, size: number) {
    const headers = this.authHeaders();
    if (!headers) {
      return new Observable<PaginatedResponse<ChatDto>>((o) => o.complete());
    }
    const pageable = { page, size, sort: ['sendAt,desc'] as string[] };
    const params = new HttpParams().set('pageable', JSON.stringify(pageable));
    return this.http.get<PaginatedResponse<ChatDto>>(`${this.baseUrl}/chats`, { headers, params });
  }
  markMessagesRead(ids: number[]) {
    return this.http.put<void>(`${environment.backendUbsLink}/ubs/telegram/messages`, {
      messagesIds: ids
    });
  }

  getMessages(chatInternalId: number, page: number, size: number) {
    const headers = this.authHeaders();
    if (!headers) {
      return new Observable<PaginatedResponse<MessageDto>>((o) => o.complete());
    }
    return this.http.get<PaginatedResponse<MessageDto>>(
      `${this.baseUrl}/messages/${chatInternalId}?page=${page}&size=${size}&sort=sendAt,desc`,
      { headers }
    );
  }

  sendMessage(chatInternalId: number, text: string, file?: File) {
    const headers = this.authHeaders();
    if (!headers) {
      return new Observable<string>((o) => o.complete());
    }
    const url = `${this.baseUrl}/messages`;
    const data = new Blob([JSON.stringify({ chatId: chatInternalId, text })], { type: 'application/json' });
    const form = new FormData();
    form.append('data', data);
    if (file) {
      form.append('files', file);
    }
    return this.http.post<string>(url, form, { headers, responseType: 'text' as 'json' });
  }

  editMessage(chatInternalId: number, messageId: number, newText: string) {
    const headers = this.authHeaders();
    if (!headers) {
      return new Observable<string>((o) => o.complete());
    }
    const url = `${this.baseUrl}/message/edit`;
    const data = new Blob([JSON.stringify({ chatId: chatInternalId, messageId: messageId, newText })], { type: 'application/json' });
    const form = new FormData();
    form.append('data', data);
    return this.http.put<string>(url, form, { headers, responseType: 'text' as 'json' });
  }

  getLastOrder(chatInternalId: number) {
    const headers = this.authHeaders();
    if (!headers) {
      return new Observable<ClientInfoRecord>((o) => o.complete());
    }
    return this.http.get<ClientInfoRecord>(`${this.baseUrl}/last-order?chatId=${chatInternalId}`, { headers });
  }
}
