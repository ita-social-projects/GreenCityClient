import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { TablesResponse } from '../models/table.model';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  url = environment.backendLink;
  constructor(private readonly http: HttpClient) {}

  getTableNames(): Observable<TablesResponse> {
    return this.http.get<TablesResponse>(`${this.url}export/settings/tables`);
  }

  getTableData(name: string, limit = '10000', offset = '0'): Observable<any> {
    return this.http.get<any>(`${this.url}export/settings/select?tableName=${name}&limit=${limit}&offset=${offset}`);
  }
}
