import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private http = inject(HttpClient);

  loadImageAsFile(url: string, type: string): Observable<File> {
    const filename = url.split('/').pop();
    return this.http.get(url, { responseType: 'blob' }).pipe(map((blob) => new File([blob], filename, { type: type })));
  }
}
