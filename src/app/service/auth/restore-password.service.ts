import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {mainLink} from '../../links';

@Injectable({providedIn: 'root'})
export class RestorePasswordService {
  apiUrl = `${mainLink}ownSecurity`;

  constructor(protected http: HttpClient) {}

  sendEmailForRestore(email, lang = 'en'): any {
      return this.http.get(`${this.apiUrl}/restorePassword?email=${email}&lang=${lang}`);
    }
}
