import { PaginationConfig, CommentsDTO, CommentsModel } from '../../models/comments-model';
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommentsService } from '../../services/comments.service';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';

@Component({
  selector: 'app-comments-container',
  templateUrl: './comments-container.component.html',
  styleUrls: ['./comments-container.component.scss']
})
export class CommentsContainerComponent implements OnInit, OnDestroy {
  @Input() public entityId: number;
  @Input() public dataType = 'comment';
  @Input() public comment: CommentsDTO;
  @Input() public config: PaginationConfig = {
    id: 'comment',
    itemsPerPage: 10,
    currentPage: 0,
    totalItems: 0
  };
  @Output() public repliesCounter = new EventEmitter();
  public elementsList: CommentsDTO[] = [];
  public commentsSubscription: Subscription;
  public isLoggedIn: boolean;
  public userId: number;
  public totalElements: number;
  public elementsArePresent = true;

  constructor(private commentsService: CommentsService, private route: ActivatedRoute, private userOwnAuthService: UserOwnAuthService) {}

  ngOnInit() {
    this.checkUserSingIn();
    this.userOwnAuthService.getDataFromLocalStorage();
    this.addCommentByPagination();
    this.getActiveComments();
    this.getCommentsTotalElements();
    if (this.dataType === 'reply') {
      this.config.id = this.comment.id.toString();
    }
  }

  public addCommentByPagination(page = 0): void {
    if (this.dataType === 'comment') {
      this.commentsSubscription = this.commentsService
        .getActiveCommentsByPage(this.entityId, page, this.config.itemsPerPage)
        .subscribe((list: CommentsModel) => this.setCommentsList(list));
    } else {
      this.commentsSubscription = this.commentsService
        .getActiveRepliesByPage(this.comment.id, page, this.config.itemsPerPage)
        .subscribe((list: CommentsModel) => this.setCommentsList(list));
    }
  }

  public setCommentsList(data: CommentsModel): void {
    this.elementsList = [...data.page];
    this.elementsArePresent = this.elementsList.length > 0;
  }

  public updateElementsList(): void {
    this.addCommentByPagination();
    this.getCommentsTotalElements();
    this.getActiveComments();
  }

  public getCommentsTotalElements(): void {
    this.dataType === 'comment'
      ? this.commentsService.getCommentsCount(this.entityId).subscribe((data: number) => (this.totalElements = data))
      : this.commentsService.getRepliesAmount(this.comment.id).subscribe((data: number) => this.repliesCounter.emit(data));
  }

  public getActiveComments(): void {
    this.dataType === 'comment'
      ? this.commentsService.getActiveCommentsByPage(this.entityId, 0, this.config.itemsPerPage).subscribe((el: CommentsModel) => {
          this.setData(el.currentPage, el.totalElements);
        })
      : this.commentsService.getActiveRepliesByPage(this.comment.id, 0, this.config.itemsPerPage).subscribe((el: CommentsModel) => {
          this.setData(el.currentPage, el.totalElements);
        });
  }

  public setData(currentPage: number, totalElements: number) {
    this.config.currentPage = currentPage;
    this.config.totalItems = totalElements;
  }

  private checkUserSingIn(): void {
    this.userOwnAuthService.credentialDataSubject.subscribe((data) => {
      this.isLoggedIn = data && data.userId;
      this.userId = data.userId;
    });
  }

  ngOnDestroy() {
    this.commentsSubscription.unsubscribe();
  }
}
