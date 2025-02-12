import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { placeLink } from '../../../../main/links';
import { Comment } from '../../../../main/model/comment/comment';
import { AddedCommentDTO, CommentFormData } from 'src/app/greencity/modules/comments/models/comments-model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private http: HttpClient) {}

  addCommentByEntityId(entityUrl: string, formData: CommentFormData): Observable<AddedCommentDTO> {
    const { text, imageFiles, parentCommentId = 0 } = formData;
    const formPayload = new FormData();
    const requestPayload = JSON.stringify({
      text,
      parentCommentId
    });
    formPayload.append('request', requestPayload);
    imageFiles.forEach((file) => formPayload.append('images', file, file.name));
    return this.http.post<AddedCommentDTO>(entityUrl, formPayload);
  }

  saveCommentByPlaceId(id: number, comment: Comment) {
    this.http.post(`${placeLink}${id}/comments`, comment);
  }
}
