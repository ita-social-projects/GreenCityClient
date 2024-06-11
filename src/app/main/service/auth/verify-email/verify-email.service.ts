import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { verifyEmailLink } from 'src/app/main/links';

@Injectable({
  providedIn: 'root'
})
export class VerifyEmailService {
  constructor(private http: HttpClient) {}

  // check if the token is still valid
  public onCheckToken(token: string, userId: string) {
    return this.http.get(`${verifyEmailLink}?token=${token}&user_id=${userId}`);
  }
}
