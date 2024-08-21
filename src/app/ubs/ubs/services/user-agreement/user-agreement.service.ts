import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TUserAgreementText } from '@ubs/ubs-admin/models/user-agreement.interface';
import { Observable } from 'rxjs';
import { mainUbsLink } from 'src/app/main/links';

@Injectable({
  providedIn: 'root'
})
export class UserAgreementService {
  private readonly API_ROUTES = {
    getUserAgreement: `${mainUbsLink}/user-agreement/latest`
  };

  private http: HttpClient = inject(HttpClient);

  getUserAgreement(): Observable<TUserAgreementText> {
    return this.http.get<TUserAgreementText>(this.API_ROUTES.getUserAgreement);
  }
}
