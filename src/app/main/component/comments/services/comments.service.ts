import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddedCommentDTO, CommentsModel } from '../models/comments-model';

@Injectable({
  providedIn: 'root'
})
export abstract class CommentsService {
  abstract addComment(entityId: number, text: string, id): Observable<AddedCommentDTO>;

  abstract getActiveCommentsByPage(entityId: number, page: number, size: number): Observable<CommentsModel>;

  abstract getCommentsCount(entityId: number): Observable<number>;

  abstract getActiveRepliesByPage(id: number, page: number, size: number): Observable<CommentsModel>;

  abstract deleteComments(id: number): Observable<boolean>;

  abstract getCommentLikes(id: number): Observable<number>;

  abstract getRepliesAmount(id: number): Observable<number>;

  abstract postLike(id: number): Observable<void>;

  abstract editComment(id: number, text: string): Observable<void>;
}
