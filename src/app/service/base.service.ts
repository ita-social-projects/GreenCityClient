import {HttpClient} from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';

export class BaseService {
  protected apiUrl = 'http://localhost:8080';
  constructor(protected http: HttpClient) {}
}
