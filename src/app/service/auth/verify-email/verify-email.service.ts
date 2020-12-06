import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mainLink } from 'src/app/links';

@Injectable({
  providedIn: 'root'
})
export class VerifyEmailService {

  constructor( private http: HttpClient ) { }

  // check if the token is still valid
  public onCheckToken(token: string, user_id: string) {
    return this.http.get(`${mainLink}ownSecurity/verifyEmail?token=${token}&user_id=${user_id}`)
  }
}
