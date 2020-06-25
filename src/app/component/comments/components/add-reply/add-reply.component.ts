import {Component, Input, OnInit} from '@angular/core';
import {CommentsService} from "../../services/comments.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {UserOwnAuthService} from "@global-service/auth/user-own-auth.service";
import {CommentsDTO, CommentsModel} from "../../models/comments-model";

@Component({
  selector: 'app-add-reply',
  templateUrl: './add-reply.component.html',
  styleUrls: ['./add-reply.component.scss']
})
export class AddReplyComponent implements OnInit {

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
  @Input() commentId: number;
  private isLoggedIn: boolean;

  ngOnInit() {
    this.addElemsToCurrentList();
    this.checkUserSingIn();
    this.userOwnAuthService.getDataFromLocalStorage();
  }

  public addElemsToCurrentList(): void {
    this.route.url.subscribe(url => this.commentsService.ecoNewsId = url[0].path);
    this.commenstSubscription =  this.commentsService.getCommentsByPage()
      .subscribe((list: CommentsModel) => this.setList(list));
  }

  public setList(data: CommentsModel): void {
    this.elements = [...this.elements, ...data.page];
  }

  public onSubmit(): void {
    this.commentsService.addReply(this.commentId, this.addCommentForm).subscribe(
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
