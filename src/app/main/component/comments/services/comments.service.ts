import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class CommentsService {
  abstract addComment(entityId: number, text: string, id): Observable<object>;

  abstract getActiveCommentsByPage(entityId: number, page: number, size: number): Observable<object>;

  abstract getCommentsCount(entityId: number): Observable<number>;

  abstract getActiveRepliesByPage(id: number, page: number, size: number): Observable<object>;

  abstract deleteComments(id: number): Observable<boolean>;

  abstract getCommentLikes(id: number): Observable<number>;

  abstract getRepliesAmount(id: number): Observable<number>;

  abstract postLike(id: number): Observable<object>;

  abstract editComment(id: number, text: string): Observable<object>;
}
