import { PaginationConfig, CommentsDTO, CommentsModel, AddedCommentDTO } from '../../models/comments-model';
import { Component, Input, OnInit, Output, EventEmitter, DoCheck } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-comments-container',
  templateUrl: './comments-container.component.html',
  styleUrls: ['./comments-container.component.scss']
})
export class CommentsContainerComponent implements OnInit, DoCheck {
  @Input() public entityId: number;
  @Input() public dataType = 'comment';
  @Input() public comment: CommentsDTO;
  @Input() public config: PaginationConfig = {
    id: 'comment',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };
  @Output() public repliesCounter = new EventEmitter();
  public elementsList: CommentsDTO[] = [];
  public isLoggedIn: boolean;
  public userId: number;
  public totalElements: number;
  public elementsArePresent = true;
  public userReplies: CommentsDTO[] = [];
  public showAllReplies: boolean;

  constructor(private commentsService: CommentsService, private userOwnAuthService: UserOwnAuthService) {}

  ngDoCheck(): void {
    if (this.dataType === 'reply') {
      if (!this.comment?.showAllRelies && this.showAllReplies) {
        this.userReplies = [];
      }
      if (this.comment?.showAllRelies && !this.showAllReplies) {
        this.initCommentsList();
      }
    }
    this.showAllReplies = this.comment?.showAllRelies;
  }

  ngOnInit() {
    this.checkUserSingIn();
    this.userOwnAuthService.getDataFromLocalStorage();
    this.initCommentsList();
    if (this.dataType === 'reply') {
      this.config.id = this.comment.id.toString();
    }
  }

  public initCommentsList(): void {
    this.dataType === 'comment' ? this.getComments() : this.getReplies();
  }

  public updateElementsListReply(comment: AddedCommentDTO): void {
    const reply: CommentsDTO = {
      ...comment,
      currentUserLiked: false,
      likes: 0,
      replies: 0,
      status: 'ORIGINAL'
    };

    this.userReplies = [reply, ...this.userReplies];
    this.initCommentsList();
  }

  private getComments(): void {
    this.commentsService
      .getCommentsCount(this.entityId)
      .pipe(take(1))
      .subscribe((data: number) => {
        this.totalElements = data;
        if (data) {
          this.commentsService
            .getActiveCommentsByPage(this.entityId, this.config.currentPage - 1, this.config.itemsPerPage)
            .pipe(take(1))
            .subscribe((list: CommentsModel) => {
              this.elementsList = list.page;
              this.setData(list);
            });
        }
      });
  }

  private getReplies(): void {
    this.commentsService
      .getRepliesAmount(this.comment.id)
      .pipe(take(1))
      .subscribe((data: number) => {
        this.repliesCounter.emit(data);
        if (data && this.comment.showAllRelies) {
          this.commentsService
            .getActiveRepliesByPage(this.comment.id, this.config.currentPage - 1, this.config.itemsPerPage)
            .subscribe((list: CommentsModel) => {
              this.elementsList = list.page;
              this.setData(list);
            });
        }
      });
  }

  private setData(data: CommentsModel) {
    this.config.totalItems = data.totalElements;
    this.elementsArePresent = data.totalElements > 0;
    this.elementsList = [...data.page];
  }

  private checkUserSingIn(): void {
    this.userOwnAuthService.credentialDataSubject.subscribe((data) => {
      this.isLoggedIn = data?.userId;
      this.userId = data?.userId;
    });
  }
}
