import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { restorePasswordLink } from '../../links';

@Injectable({ providedIn: 'root' })
export class RestorePasswordService {
  constructor(private http: HttpClient) {}

  sendEmailForRestore(email, lang = 'en'): any {
    return this.http.get(`${restorePasswordLink}?email=${email}&lang=${lang}`);
  }
}
