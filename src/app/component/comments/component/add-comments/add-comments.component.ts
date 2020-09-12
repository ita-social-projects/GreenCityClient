import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { CommentService } from '../../services/comment.service';
import { CommentsModel } from '../../models/comments-model';
import { CommentsDTO } from '../../models/comments-model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-add-comments',
  templateUrl: './add-comments.component.html',
  styleUrls: ['./add-comments.component.scss']
})
export class AddCommentsComponent implements OnInit {
  @Input() commentId: number;
  public avatarImage = 'assets/img/comment-avatar.png';

  public addCommentForm: FormGroup = this.fb.group({
    content: ['', [Validators.required, Validators.maxLength(8000)]],
  });
  @Output() public commentsList = new EventEmitter();

  constructor(private commentService: CommentService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private userOwnAuthService: UserOwnAuthService) { }

  ngOnInit() {
  }

  public onSubmit(): void {
    this.commentService.addComment(this.commentId, this.addCommentForm).subscribe(
      (successRes: CommentsDTO) => {
        this.commentsList.emit(successRes);
        // this.getCommentsTotalElements();
        this.addCommentForm.reset();
      }
    );
  }
}
