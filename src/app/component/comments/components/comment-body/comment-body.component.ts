import { Component, OnInit, Input } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import set = Reflect.set;

@Component({
  selector: 'app-comment-body',
  templateUrl: './comment-body.component.html',
  styleUrls: ['./comment-body.component.scss']
})
export class CommentBodyComponent implements OnInit {
  @Input() public elements = [];
  @Input() public type: string;
  public replyFormVisibility = false;
  public isLoggedIn: boolean;
  public userId: boolean;
  public tempId: number;
  public addReply = {
    placeholder: 'Add a reply',
    btnText: 'Reply',
    type: 'reply'
  };

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

  public showReplyForm(id: number): void {
    this.tempId = id;
    this.replyFormVisibility = !this.replyFormVisibility;
  }
}
