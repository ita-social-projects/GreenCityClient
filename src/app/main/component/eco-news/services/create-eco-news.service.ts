import { Injectable } from '@angular/core';
import { NewsDTO, FileHandle } from '../models/create-news-interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { FormGroup } from '@angular/forms';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { FilterModel } from '@shared/components/tag-filter/tag-filter.model';

@Injectable({
  providedIn: 'root'
})
export class CreateEcoNewsService {
  newsId: number;
  currentForm: FormGroup;
  private url: string = environment.backendLink;
  private accessToken: string = localStorage.getItem('accessToken');
  file: FileHandle = null;
  isImageValid: boolean;
  isBackToEditing: boolean;
  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'my-auth-token'
    })
  };
  private tags: FilterModel[] = [];

  constructor(private http: HttpClient) {}

  getFormData(): FormGroup {
    return this.currentForm;
  }

  getTags(): FilterModel[] {
    return this.tags;
  }

  setTags(tags: FilterModel[]): void {
    this.tags = tags;
  }

  getNewsId(): number {
    return this.newsId;
  }

  editNews(form): Observable<EcoNewsModel> {
    const body: NewsDTO = {
      id: form.id,
      tags: form.tags,
      content: form.content,
      title: form.title,
      source: form.source,
      text: form.content,
      countOfEcoNews: form.countOfEcoNews
    };

    const formData = new FormData();

    formData.append('updateEcoNewsDto', JSON.stringify(body));
    if (this.file) {
      formData.append('image', this.file.file);
      this.file = null;
    }
    this.httpOptions.headers.set('Authorization', `Bearer ${this.accessToken}`);

    return this.http.put<EcoNewsModel>(environment.backendLink + 'econews/update', formData, this.httpOptions);
  }

  setForm(form: FormGroup): void {
    this.currentForm = form;
    if (this.currentForm) {
      this.currentForm.value.image = this.file ? this.file.url : '';
    }
  }

  setNewsId(id: number): void {
    this.newsId = id;
  }

  sendFormData(form): Observable<EcoNewsModel> {
    const body: NewsDTO = {
      tags: form.tags,
      text: form.content,
      title: form.title,
      source: form.source,
      countOfEcoNews: form.countOfEcoNews
    };

    const formData = new FormData();
    formData.append('addEcoNewsDtoRequest', JSON.stringify(body));

    if (this.file) {
      formData.append('image', this.file.file);
      this.file = null;
    }
    return this.http.post<EcoNewsModel>(`${this.url}econews`, formData, this.httpOptions);
  }

  sendImagesData(imagesFilesArr: File[]): Observable<[string]> {
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
    return this.http.post<any>(environment.backendLink + 'econews/uploadImages', formData, httpOptions);
  }
}
