import { Component, OnInit, Input } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';

@Component({
  selector: 'app-comment-body',
  templateUrl: './comment-body.component.html',
  styleUrls: ['./comment-body.component.scss']
})
export class CommentBodyComponent implements OnInit {
  @Input() public elements = [];
  public isLoggedIn: boolean;
  public userId: boolean;

  constructor(private userOwnAuthService: UserOwnAuthService,
              private commentsService: CommentsService) { }

  ngOnInit() {
    this.checkUserSingIn();
    this.userOwnAuthService.getDataFromLocalStorage();
  }

  private checkUserSingIn(): void {
    this.userOwnAuthService.credentialDataSubject
      .subscribe((data) => {
        this.isLoggedIn = data && data.userId;
        this.userId = data.userId;
      });
  }
}
