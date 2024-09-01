import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddedCommentDTO, CommentsModel } from '../models/comments-model';

@Injectable({
  providedIn: 'root'
})
export abstract class CommentsService {
  abstract addComment(entityId: number, text: string, id): Observable<AddedCommentDTO>;

  abstract getActiveCommentsByPage(entityId: number, statuses: string, page: number, size: number): Observable<CommentsModel>;

  abstract getCommentsCount(entityId: number): Observable<number>;

  abstract getActiveRepliesByPage(entityId: number, id: number, statuses: string, page: number, size: number): Observable<CommentsModel>;

  abstract deleteComments(entityId: number, id: number): Observable<boolean>;

  abstract getCommentLikes(id: number): Observable<number>;

  abstract getRepliesAmount(entityId: number, id: number): Observable<number>;

  abstract postLike(entityId: number, id: number): Observable<void>;

  abstract editComment(entityId: number, id: number, text: string): Observable<void>;
}
