import { Component, OnInit, Input, EventEmitter, OnDestroy } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Validators, FormControl } from '@angular/forms';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { CommentsService } from '../../services/comments.service';
import { CommentsDTO, CommentsModel } from '../../models/comments-model';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.scss']
})
export class CommentsListComponent implements OnInit, OnDestroy {
  @Input() public commentsList: CommentsDTO[] = [];
  @Input() public dataType = 'comment';
  @Input() public currentCommentId: number;
  private commentsAmount = 10;
  public elementsArePresent = true;
  public isLoggedIn: boolean;
  public userId: number;
  public content: FormControl = new FormControl('', [Validators.required, Validators.maxLength(8000)]);
  public editIcon = 'assets/img/comments/edit.png';
  public cancelIcon = 'assets/img/comments/cancel-comment-edit.png';
  public commentsSubscription: Subscription;
  public likesCount = 0;
  public config = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 0,
    totalItems: 0
  };


  public replyFormVisibility = false;
  public tempId: number;
  public addReply = 'reply';

  constructor(private commentService: CommentService,
              private route: ActivatedRoute,
              private userOwnAuthService: UserOwnAuthService,) { }

  ngOnInit() {
    this.addEcoNewsId();
    if (this.dataType === 'comment'){
      this.addCommentByPagination();
      this.getActiveComments();
    }
    
    this.checkUserSingIn();
    this.userOwnAuthService.getDataFromLocalStorage();
  }

  public addEcoNewsId(): void {
    this.route.url.subscribe(url => this.commentService.ecoNewsId = url[0].path);
  }

  public addCommentByPagination(page = 0): void {
    this.commentService.getActiveCommentsByPage(page, this.commentsAmount)
      .subscribe((list: CommentsModel) => this.setCommentsList(list));
  }

  public addComment(data): void {
    this.commentsList = [data, ...this.commentsList];
  }

  public deleteComment(comments): void {
    this.commentsList = comments;
    if (this.dataType === 'comment') {
      this.addCommentByPagination();
    }
  }

  public setCommentsList(data: CommentsModel): void {
    this.commentsList = [...data.page];
    this.elementsArePresent = this.commentsList.length > 0;
  }

  public isCommentEdited(element: CommentsDTO): boolean {
    return element.status === 'EDITED';
  }

  private checkUserSingIn(): void {
    this.userOwnAuthService.credentialDataSubject
      .subscribe((data) => {
        this.isLoggedIn = data && data.userId;
        this.userId = data.userId;
      });
  }

  public onEdit(id: number): void {
    this.commentsList = this.commentsList.map(item => {
      item.isEdit = item.id === id && !item.isEdit;
      return item;
    });
  }

  public saveEditedComment(element: CommentsDTO): void {
    this.commentService.editComment(element.id, this.content).subscribe(
      () => this.content.reset());
    element.isEdit = false;
    element.text = this.content.value;
    element.status = 'EDITED';
  }

  public cancelEditedComment(element: CommentsDTO): void {
    element.isEdit = false;
  }

  public getActiveComments(): void {
    // if(this.dataType === 'comment'){
    //   this.commentsSubscription = this.commentService.getActiveCommentsByPage(0, this.config.itemsPerPage)
    //     .subscribe((el: CommentsModel) => {
    //       this.setData(el.currentPage, el.totalElements);
    //     });
    // } else {
    //   this.commentsSubscription = this.commentService.getAllReplies(this.currentCommentId, 0, this.config.itemsPerPage)
    //     .subscribe((el: CommentsModel) => {
    //       this.setData(el.currentPage, el.totalElements);
    //     });
    // }

    this.commentsSubscription = this.commentService.getActiveCommentsByPage(0, this.config.itemsPerPage)
      .subscribe((el: CommentsModel) => {
        this.setData(el.currentPage, el.totalElements);
      });
  }

  public setData(currentPage: number, totalElements: number) {
    this.config.currentPage = currentPage;
    this.config.totalItems = totalElements;
  }

  ngOnDestroy() {
    this.commentsSubscription.unsubscribe();
  }
}
