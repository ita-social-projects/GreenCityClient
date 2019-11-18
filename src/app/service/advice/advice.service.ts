import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AdviceDto} from '../../model/advice/AdviceDto';
import {adviceRandomLink} from '../../links';

@Injectable({
  providedIn: 'root'
})
export class AdviceService {

  constructor(private http: HttpClient) {
  }

  getAdvice(id: number): Observable<AdviceDto> {
    return this.http.get<AdviceDto>(adviceRandomLink + id);
  }
}
