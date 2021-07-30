import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { mainLink, placeLink } from '../../links';
import { Comment } from '../../model/comment/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = `${mainLink}`;

  constructor(private http: HttpClient) {}

  saveCommentByPlaceId(id: number, comment: Comment) {
    this.http.post(`${placeLink}${id}/comments`, comment);
  }
}
