import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ISignInResponse } from '@global-models/auth/sign-in-response.interface';
import { ISignIn } from '@global-models/auth/sign-in.interface';
import { JwtService } from '@global-service/jwt/jwt.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { map, Observable } from 'rxjs';
import { mainUserLink } from 'src/app/main/links';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private jwtService = inject(JwtService);
  private localStorageService = inject(LocalStorageService);

  private readonly API_ROUTES = {
    signIn: () => `${mainUserLink}ownSecurity/signIn`
  };

  signIn(data: ISignIn): Observable<ISignInResponse> {
    return this.http.post<ISignInResponse>(this.API_ROUTES.signIn(), data).pipe(map((response) => this.decodeUserRole(response)));
  }

  saveDataToLocalStorage(data: ISignInResponse) {
    this.localStorageService.setAccessToken(data.accessToken);
    this.localStorageService.setRefreshToken(data.refreshToken);
    this.localStorageService.setUserId(data.userId);
    this.localStorageService.setFirstName(data.name);
  }

  private decodeUserRole(response: ISignInResponse): ISignInResponse {
    return {
      ...response,
      userRole: this.jwtService.getUserRole(response.accessToken)
    };
  }
}
