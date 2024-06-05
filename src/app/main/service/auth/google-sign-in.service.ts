import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { googleSecurityLink } from '../../links';
import { Observable } from 'rxjs';
import { UserSuccessSignIn } from '../../model/user-success-sign-in';

@Injectable({
  providedIn: 'root'
})
export class GoogleSignInService {
  constructor(private http: HttpClient) {}

  public signIn(token: string, lang = 'en'): Observable<UserSuccessSignIn> {
    return this.http.get<UserSuccessSignIn>(`${googleSecurityLink}?idToken=${token}&lang=${lang}`);
  }
}
