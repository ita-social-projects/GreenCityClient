import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { placeLink } from '../../links';
import { Comment } from '../../model/comment/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private http: HttpClient) {}

  saveCommentByPlaceId(id: number, comment: Comment) {
    this.http.post(`${placeLink}${id}/comments`, comment);
  }
}
