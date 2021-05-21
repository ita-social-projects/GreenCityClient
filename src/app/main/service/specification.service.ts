import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mainLink } from '../links';
import { SpecificationNameDto } from '../model/specification/SpecificationNameDto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpecificationService {
  private readonly apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${mainLink}` + '/specification';
  }

  findAllSpecification(): Observable<SpecificationNameDto[]> {
    return this.http.get<SpecificationNameDto[]>(`${mainLink}specification`);
  }
}
