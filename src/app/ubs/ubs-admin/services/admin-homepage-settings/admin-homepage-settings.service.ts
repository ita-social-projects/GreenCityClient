import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mainUbsLink } from 'src/app/main/links';
import { THomepageContentChange, THomepageSettings } from '@ubs/ubs-admin/models/homepage-settings.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminHomepageSettingsService {
  private readonly API_ROUTES = {
    getHomepageText: () => `${mainUbsLink}/ubs/superAdmin/settingsText`,
    updateHomepageText: () => `${mainUbsLink}/ubs/superAdmin/settingsText/section`
  };

  constructor(private http: HttpClient) {}

  getHomepageContent(): Observable<THomepageSettings> {
    return this.http.get<THomepageSettings>(this.API_ROUTES.getHomepageText());
  }

  updateHomepageContent(section: string, changes: THomepageContentChange[]): Observable<void> {
    return this.http.put<void>(this.API_ROUTES.updateHomepageText(), changes, { params: { section: section } });
  }
}
