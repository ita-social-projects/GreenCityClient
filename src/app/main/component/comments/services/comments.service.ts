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

  abstract getActiveRepliesByPage(entityId: number, parentCommentId: number, page: number, size: number): Observable<CommentsModel>;

  abstract deleteComments(entityId: number, commentId: number): Observable<boolean>;

  abstract getCommentLikes(commentId: number): Observable<number>;

  abstract getRepliesAmount(entityId: number, parentCommentId: number): Observable<number>;

  abstract postLike(entityId: number, commentId: number): Observable<void>;

  abstract editComment(entityId: number, commentId: number, text: string): Observable<void>;
}
