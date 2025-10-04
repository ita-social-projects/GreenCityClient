import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mainUbsLink } from 'src/app/main/links';
import { THomepageContent, THomepageSettings } from '@ubs/ubs-admin/models/homepage-settings.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminUserAgreementService {
  private readonly API_ROUTES = {
    getHomepageText: () => `${mainUbsLink}/ubs/superAdmin/settingsText`,
    updateHomepageText: () => `${mainUbsLink}/ubs/user-agreement`
  };

  private http: HttpClient = inject(HttpClient);

  getHomepageContent(): Observable<THomepageSettings> {
    return this.http.get<THomepageSettings>(this.API_ROUTES.getHomepageText());
  }

  updateHomepageContent(data: THomepageContent): Observable<void> {
    return this.http.post<void>(this.API_ROUTES.updateHomepageText(), data);
  }
}
