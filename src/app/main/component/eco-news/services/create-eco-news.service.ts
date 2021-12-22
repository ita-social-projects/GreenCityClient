import { Injectable } from '@angular/core';
import { NewsDTO, NewsResponseDTO, FileHandle } from '../models/create-news-interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CreateEcoNewsService {
  public newsId: string;
  public currentForm: FormGroup;
  private url: string = environment.backendLink;
  private accessToken: string = localStorage.getItem('accessToken');
  public files: FileHandle[] = [];
  public fileUrl: string;
  public isImageValid: boolean;
  public isBackToEditing: boolean;
  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) {}

  public getFormData(): FormGroup {
    return this.currentForm;
  }

  public getNewsId(): string {
    return this.newsId;
  }

  public editNews(form): Observable<NewsResponseDTO> {
    let body: NewsDTO = {
      id: form.id,
      tags: form.tags,
      text: form.content,
      title: form.title,
      source: form.source
    };

    const formData = new FormData();

    if (this.files.length !== 0) {
      body = {
        ...body,
        image: this.files[0].url
      };
    }
    this.files = [];
    formData.append('updateEcoNewsDto', JSON.stringify(body));
    this.httpOptions.headers.set('Authorization', `Bearer ${this.accessToken}`);

    return this.http.put<NewsResponseDTO>('https://greencity.azurewebsites.net/econews/update', formData, this.httpOptions);
  }

  public setForm(form: FormGroup): void {
    this.currentForm = form;
    if (this.currentForm) {
      this.currentForm.value.image = this.files[0] ? this.files[0].url : '';
    }
  }

  public setNewsId(id: string): void {
    this.newsId = id;
  }

  public sendFormData(form): Observable<NewsResponseDTO> {
    const body: NewsDTO = {
      tags: form.value.tags,
      text: form.value.content,
      title: form.value.title,
      source: form.value.source
    };

    const formData = new FormData();

    if (this.files.length !== 0) {
      body.image = this.files[0].url;
      console.log(body.image);
    }
    this.files = [];

    formData.append('addEcoNewsDtoRequest', JSON.stringify(body));
    this.httpOptions.headers.set('Authorization', `Bearer ${this.accessToken}`);
    return this.http.post<NewsResponseDTO>(`${this.url}econews`, formData, this.httpOptions);
  }

  public sendImagesData(imagesFilesArr: File[]): Observable<[string]> {
    const formData: FormData = new FormData();

    imagesFilesArr.forEach((f: File) => {
      formData.append('images', f);
    });

    const accessToken: string = localStorage.getItem('accessToken');
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'my-auth-token'
      })
    };
    httpOptions.headers.set('Authorization', `Bearer ${accessToken}`);
    httpOptions.headers.append('Content-Type', 'multipart/form-data');
    return this.http.post<any>('https://greencity.azurewebsites.net/econews/uploadImages', formData, httpOptions);
  }
}
