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
  @Input() public elements: any[] = [];

  public isLoggedIn: boolean;
  public userId: boolean;
  public commentCurrentPage: number;
  public commentTotalItems: number;
  public commentsSubscription: Subscription;
  public isEdit = false;
  public content: FormControl = new FormControl('');

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

  public onEdit(index) {
    this.elements = this.elements.map((item, ind) => {
      if (ind === index && !item.isEdit) {
        item.isEdit = true;
        return item;
      } else {
        item.isEdit = false;
        return item;
      }
    });
  }

  public saveEditedComment(id) {
    console.log(this.content.value);
    this.commentsService.editComment(id, this.content).subscribe(response => {
      console.log(response);
    });
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
