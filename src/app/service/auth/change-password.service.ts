import {Injectable} from '@angular/core';
import {mainLink} from '../../links';
import {HttpClient} from '@angular/common/http';
import {RestoreDto} from '../../model/restroreDto';
import {NgFlashMessageService} from 'ng-flash-messages';

@Injectable({providedIn: 'root'})
export class ChangePasswordService {
  apiUrl = `${mainLink}ownSecurity`;

  constructor(protected http: HttpClient, private ngFlashMessageService: NgFlashMessageService) {

  }

  changePassword(dto: RestoreDto) {
    return this.http.post(`${this.apiUrl}/changePassword`, dto).subscribe(() => {
      this.ngFlashMessageService.showFlashMessage({
        messages: ['Password was changed successfully.'],
        dismissible: true,
        timeout: 3000,
        type: 'success'
      });
    });
  }
}
