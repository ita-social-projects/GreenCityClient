import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FileHandle } from '@eco-news-models/create-news-interface';
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

  createFileHandle(url: string, type: string): Observable<FileHandle> {
    return new Observable<FileHandle>((observer) => {
      this.loadImageAsFile(url, type).subscribe((file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          const fileHandle: FileHandle = { url: base64data, file: file };
          observer.next(fileHandle);
          observer.complete();
        };
      });
    });
  }
}
