import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { CommentService } from '../../services/comment.service';
import { CommentsModel } from '../../models/comments-model';
import { CommentsDTO } from '../../models/comments-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comments-main',
  templateUrl: './comments-main.component.html',
  styleUrls: ['./comments-main.component.scss']
})
export class CommentsMainComponent implements OnInit {
  @Input() commentId: number;
  public repliesList;
  public repliesSubscription: Subscription;
  public showRelies = false;

  constructor(private commentService: CommentService,) { }

  ngOnInit() {
    this.addElemsToRepliesList();
  }

  addElemsToRepliesList() {
    this.repliesSubscription = this.commentService.getAllReplies(this.commentId)
      .subscribe((list: CommentsModel) => {
        this.repliesList = list.page.filter(item => item.status !== 'DELETED');
      });
  };

  public showReliesList(): void {
    this.showRelies = !this.showRelies;
    console.log(this.repliesList)
  }
}
