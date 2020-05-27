import { Injectable } from '@angular/core';
import { NewsModel, TranslationModel, NewsDTO, NewsResponseDTO } from '../models/create-news-interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { FileHandle } from '../models/create-news-interface';

@Injectable({
  providedIn: 'root'
})
export class CreateEcoNewsService {
  private currentForm: FormGroup;
  private url: string = environment.backendLink;
  private accessToken: string = localStorage.getItem('accessToken');
  public files: FileHandle[] = [];
  public fileUrl: string;
  public isImageValid: boolean;
  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) { }

  public getFormData(): FormGroup {
    return this.currentForm;
  }

  public setForm(form: FormGroup): void {
    this.currentForm = form;
    if (this.currentForm) {
      this.currentForm.value.image = this.files[0] ?
      this.files[0].url : '';
    }
  }

  public sendFormData(form): Observable<NewsResponseDTO> {
    const body: NewsDTO = {
      "tags": form.value.tags,
      "text": form.value.content,
      "title": form.value.title,
      "source": form.value.source,
      "image": null
    };

    let formData = new FormData();

    if (this.files.length !== 0) {
      body.image = this.files[0].url
    }

    formData.append('addEcoNewsDtoRequest', JSON.stringify(body));

    this.httpOptions.headers.set('Authorization', `Bearer ${this.accessToken}`);
    return this.http.post<NewsResponseDTO>(`${this.url}/econews`, formData, this.httpOptions);
  }
}
