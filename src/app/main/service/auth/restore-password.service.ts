import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { restorePasswordLink } from '../../links';

@Injectable({ providedIn: 'root' })
export class RestorePasswordService {
  constructor(private http: HttpClient) {}

  sendEmailForRestore(email: string, lang = 'en', isUbs?: boolean): any {
    const ubsEmailMessage = isUbs ? '&ubs=isUbs' : '';
    return this.http.get(`${restorePasswordLink}?email=${email}&lang=${lang}${ubsEmailMessage}`);
  }
}
