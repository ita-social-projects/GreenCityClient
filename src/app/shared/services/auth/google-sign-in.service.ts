import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { googleSecurityLink } from '../../../main/links';
import { Observable } from 'rxjs';
import { UserSuccessSignIn } from '../../models/singIn-singUp/user-success-sign-in';
import { ProjectNameEnum } from '../../models/auth/project-name.enum';

@Injectable({
  providedIn: 'root'
})
export class GoogleSignInService {
  constructor(private http: HttpClient) {}

  signIn(token: string, isUbs: boolean, lang = 'en'): Observable<UserSuccessSignIn> {
    const projectName = isUbs ? ProjectNameEnum.UBS : ProjectNameEnum.GREENCITY;
    return this.http.get<UserSuccessSignIn>(`${googleSecurityLink}?token=${token}&lang=${lang}&projectName=${projectName}`);
  }
}
