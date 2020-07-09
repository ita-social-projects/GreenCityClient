import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { CommentsService } from '../../services/comments.service';
import { CommentsModel } from '../../models/comments-model';
import { CommentsDTO } from '../../models/comments-model';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent implements OnInit {
  @Input() commentId: number;
  @Input() dataSet = {
    placeholder: 'Add a comment',
    btnText: 'Comment',
    type: 'comment'
  };

  constructor(private commentsService: CommentsService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private userOwnAuthService: UserOwnAuthService) { }

  public avatarImage = 'assets/img/comment-avatar.png';
  public addCommentForm: FormGroup = this.fb.group({
    content: ['', [Validators.required, Validators.maxLength(8000)]],
  });
  public commenstSubscription;
  public elements = [];
  private isLoggedIn: boolean;

  ngOnInit() {
    if (this.dataSet.type === 'comment') {
      this.addElemsToCurrentList();
    } else if (this.dataSet.type === 'reply') {
      this.addElemsToRepliesList();
    }
    this.checkUserSingIn();
    this.userOwnAuthService.getDataFromLocalStorage();
  }

  public addElemsToCurrentList(): void {
    this.route.url.subscribe(url => this.commentsService.ecoNewsId = url[0].path);
    this.commenstSubscription =  this.commentsService.getCommentsByPage()
        .subscribe((list: CommentsModel) => this.setList(list));
  }

  private addElemsToRepliesList(): void {
    this.commenstSubscription = this.commentsService.getAllReplies(this.commentId)
      .subscribe((list: CommentsModel) => this.setRepliesList(list));
  }

  public setList(data: CommentsModel): void {
    this.elements = [...this.elements, ...data.page];
  }

  private setRepliesList(data): void {
    this.elements = [...this.elements, ...data];
  }

  public onSubmit(): void {
    this.commentsService.addComment(this.commentId, this.addCommentForm).subscribe(
      (successRes: CommentsDTO) => {
        this.elements = [successRes, ...this.elements];
        this.addCommentForm.reset();
      }
    );
  }

  private checkUserSingIn(): void {
    this.userOwnAuthService.credentialDataSubject
      .subscribe((data) => this.isLoggedIn = data && data.userId);
  }
}
