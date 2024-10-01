import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TUserAgreementAdmin, TUserAgreementText } from '@ubs/ubs-admin/models/user-agreement.interface';
import { map, Observable } from 'rxjs';
import { mainUbsLink } from 'src/app/main/links';

@Injectable({
  providedIn: 'root'
})
export class AdminUserAgreementService {
  private readonly API_ROUTES = {
    getUserAgreement: (version: string) => `${mainUbsLink}/user-agreement/${version}`,
    updateUserAgreement: () => `${mainUbsLink}/user-agreement`,
    getAllVersions: () => `${mainUbsLink}/user-agreement`
  };

  private http: HttpClient = inject(HttpClient);

  getUserAgreement(version: string): Observable<TUserAgreementAdmin> {
    return this.http.get<TUserAgreementAdmin>(this.API_ROUTES.getUserAgreement(version));
  }

  updateUserAgreement(data: TUserAgreementText): Observable<void> {
    return this.http.post<void>(this.API_ROUTES.updateUserAgreement(), data);
  }

  getAllVersions(): Observable<string[]> {
    return this.http.get<string[]>(this.API_ROUTES.getAllVersions()).pipe(map(this.prepareVersions));
  }

  //Sort in descending order to show the latest version first
  private prepareVersions(versions: string[]): string[] {
    return versions.reverse();
  }
}
