import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { CommentsService } from '../../services/comments.service';
import { CommentsDTO, CommentsModel } from '../../models/comments-model';

@Component({
  selector: 'app-comment-body',
  templateUrl: './comment-body.component.html',
  styleUrls: ['./comment-body.component.scss']
})
export class CommentBodyComponent implements OnInit, OnDestroy {

  constructor(private userOwnAuthService: UserOwnAuthService,
              private commentsService: CommentsService,
              private fb: FormBuilder) {}
  @Input() public elements: CommentsDTO[] = [];

  public isLoggedIn: boolean;
  public userId: boolean;
  public commentCurrentPage: number;
  public commentTotalItems: number;
  public commentsSubscription: Subscription;
  public content: FormControl = new FormControl('', [Validators.required, Validators.maxLength(8000)]);
  public editIcon = 'assets/img/comments/edit.png';
  public cancelIcon = 'assets/img/comments/cancel-comment-edit.png';

  public config = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: this.commentTotalItems,
    totalItems: this.commentTotalItems
  };

  ngOnInit() {
    this.getAllComments();
    this.checkUserSingIn();
    this.userOwnAuthService.getDataFromLocalStorage();
  }

  public onEdit(index: number): void {
    this.elements = this.elements.map((item, idx) => {
      item.isEdit = idx === index && !item.isEdit ? true : false;
      return item;
    });
  }

  public saveEditedComment(element: CommentsDTO): void {
    this.commentsService.editComment(element.id, this.content).subscribe();
    element.isEdit = false;
    if (this.content.value) {
      element.text = this.content.value;
      element.status = 'EDITED';
    }
  }

  public cancelEditedComment(element: CommentsDTO): void {
    element.isEdit = false;
  }

  public isCommentEdited(element): boolean {
    return element.status === 'EDITED' ? true : false;
  }

  public getAllComments(): void {
    this.commentsSubscription = this.commentsService.getCommentsByPage()
      .subscribe((el: CommentsModel) =>
        this.setData(el.currentPage, el.totalElements));
  }

  public setData(currentPage, totalElements) {
    this.commentCurrentPage = currentPage;
    this.commentTotalItems = totalElements;
  }

  private checkUserSingIn(): void {
    this.userOwnAuthService.credentialDataSubject
      .subscribe((data) => {
        this.isLoggedIn = data && data.userId;
        this.userId = data.userId;
      });
  }

  ngOnDestroy() {
    this.commentsSubscription.unsubscribe();
  }
}
