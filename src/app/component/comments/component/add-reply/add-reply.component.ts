import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { CommentService } from '../../services/comment.service';
import { CommentsModel } from '../../models/comments-model';
import { CommentsDTO } from '../../models/comments-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-relies-list',
  templateUrl: './add-reply.component.html',
  styleUrls: ['./add-reply.component.scss']
})
export class AddReplyComponent implements OnInit {
  public repliesList;
  @Input() commentId: number;
  public commentsSubscription: Subscription;
  constructor(private commentService: CommentService,) { }

  ngOnInit() {
  }

}
