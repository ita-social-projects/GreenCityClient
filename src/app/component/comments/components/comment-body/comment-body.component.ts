import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import { Subscription } from 'rxjs';
import { Validators, FormControl } from '@angular/forms';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { CommentsService } from '../../services/comments.service';
import { CommentsDTO, CommentsModel } from '../../models/comments-model';

@Component({
  selector: 'app-comment-body',
  templateUrl: './comment-body.component.html',
  styleUrls: ['./comment-body.component.scss']
})
export class CommentBodyComponent implements OnInit, OnDestroy {
  @Input() public elements: CommentsDTO[] = [];
  @Input() public type: string;
  @Output() public commentsPage = new EventEmitter();
  public replyFormVisibility = false;
  public isLoggedIn: boolean;
  public userId: number;
  public commentsSubscription: Subscription;
  public content: FormControl = new FormControl('', [Validators.required, Validators.maxLength(8000)]);
  public editIcon = 'assets/img/comments/edit.png';
  public cancelIcon = 'assets/img/comments/cancel-comment-edit.png';

  public tempId: number;
  public addReply = {
    placeholder: 'Add a reply',
    btnText: 'Reply',
    type: 'reply'
  };
  public config = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 0,
    totalItems: 0
  };

  constructor(private userOwnAuthService: UserOwnAuthService,
              private commentsService: CommentsService) {}

  ngOnInit() {
    this.getActiveComments();
    this.checkUserSingIn();
    this.userOwnAuthService.getDataFromLocalStorage();
  }

  public onEdit(id: number): void {
    this.elements = this.elements.map(item => {
      item.isEdit = item.id === id && !item.isEdit;
      return item;
    });
  }

  public saveEditedComment(element: CommentsDTO): void {
    this.commentsService.editComment(element.id, this.content).subscribe();
    element.isEdit = false;
    element.text = this.content.value;
    element.status = 'EDITED';
  }

  public cancelEditedComment(element: CommentsDTO): void {
    element.isEdit = false;
  }

  public isCommentEdited(element: CommentsDTO): boolean {
    return element.status === 'EDITED';
  }

  public getActiveComments(): void {
    this.commentsSubscription = this.commentsService.getActiveCommentsByPage(0, this.config.itemsPerPage)
      .subscribe((el: CommentsModel) => {
        this.setData(el.currentPage, el.totalElements);
      });
  }

  public getCommentsByPage(pageNumber: number): void {
    this.commentsPage.emit(pageNumber - 1);
  }

  public setData(currentPage: number, totalElements: number) {
    this.config.currentPage = currentPage;
    this.config.totalItems = totalElements;
  }

  private checkUserSingIn(): void {
    this.userOwnAuthService.credentialDataSubject
      .subscribe((data) => {
        this.isLoggedIn = data && data.userId;
        this.userId = data.userId;
      });
  }

  public showReplyForm(id: number): void {
    this.tempId = id;
    this.replyFormVisibility = !this.replyFormVisibility;
  }

  public showReplies(id: number): void {
    if (this.tempId === id && this.replyFormVisibility) {
      this.commentsService.setVisibility();
    }
  }

  ngOnDestroy() {
    this.commentsSubscription.unsubscribe();
  }
}
