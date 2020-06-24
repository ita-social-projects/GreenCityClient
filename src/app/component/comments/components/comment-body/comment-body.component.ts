import { Component, OnInit, Input } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import set = Reflect.set;

@Component({
  selector: 'app-comment-body',
  templateUrl: './comment-body.component.html',
  styleUrls: ['./comment-body.component.scss']
})
export class CommentBodyComponent {
  @Input() public elements = [];
  public isLoggedIn: boolean;
  public likes: any;

  constructor(private userOwnAuthService: UserOwnAuthService,
              private commentsService: CommentsService) { }

  ngOnInit() {
    this.checkUserSingIn();
    this.userOwnAuthService.getDataFromLocalStorage();
  }

  private checkUserSingIn(): void {
    this.userOwnAuthService.credentialDataSubject
      .subscribe((data) => this.isLoggedIn = data && data.userId);
  }

  // public setLikes(id: number): void {
  //   this.commentsService.getCommentLikes(id)
  //     .subscribe((data) => this.likes = data);
  // }
}
