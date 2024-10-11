import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddedCommentDTO, CommentsModel } from '../models/comments-model';

@Injectable({
  providedIn: 'root'
})
export abstract class CommentsService {
  abstract addComment(entityId: number, text: string, parentCommentId: number): Observable<AddedCommentDTO>;

  abstract getActiveCommentsByPage(entityId: number, page: number, size: number): Observable<CommentsModel>;

  abstract getCommentsCount(entityId: number): Observable<number>;

  abstract getActiveRepliesByPage(entityId: number, parentCommentId: number, page: number, size: number): Observable<CommentsModel>;

  abstract deleteComments(parentCommentId: number): Observable<boolean>;

  abstract getCommentLikes(entityId: number, parentCommentId: number): Observable<number>;

  abstract getRepliesAmount(entityId: number, parentCommentId: number): Observable<number>;

  abstract postLike(parentCommentId: number): Observable<void>;

  abstract editComment(parentCommentId: number, text: string): Observable<void>;
}
