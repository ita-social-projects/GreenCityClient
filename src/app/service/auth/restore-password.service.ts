import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {mainLink} from '../../links';
import {NgFlashMessageService} from 'ng-flash-messages';

@Injectable({providedIn: 'root'})
export class RestorePasswordService {
  apiUrl = `${mainLink}ownSecurity`;

  constructor(protected http: HttpClient, private ngFlashMessageService: NgFlashMessageService) {

  }

  sendEmailForRestore(email: string): any {
    return this.http.get(`${this.apiUrl}/restorePassword/?email=${email}`).subscribe(() => {
      this.ngFlashMessageService.showFlashMessage({
        messages: ['Your request for restoring password was created successfully. Please check your email.'],
        dismissible: true,
        timeout: 3000,
        type: 'success'
      });
    });
  }
}
