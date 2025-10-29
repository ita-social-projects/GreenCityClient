import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TPaginatedMessages } from '@ubs/ubs-admin/models/telegram-bot-responses.interface';
import { Observable } from 'rxjs';
import { mainUbsLink } from 'src/app/main/links';

@Injectable({
  providedIn: 'root'
})
export class AdminTelegramBotResponseService {
  private readonly API_ROUTE = `${mainUbsLink}/ubs/telegram/bot_responses`;

  private http: HttpClient = inject(HttpClient);

  getTelegramBotResponses(): Observable<TPaginatedMessages> {
    return this.http.get<TPaginatedMessages>(this.API_ROUTE);
  }
  updateTelegramBotResponses(id: number, text: string) {
    return this.http.put<void>(this.API_ROUTE, { id: id, text: text });
  }
}
