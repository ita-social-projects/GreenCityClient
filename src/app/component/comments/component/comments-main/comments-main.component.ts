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
  public repliesList: CommentsDTO[] = [];
  public repliesSubscription: Subscription;
  public showRelies = false;
  public showAddReply = false;
  private repliesAmount = 10;

  constructor(private commentService: CommentService,) { }

  ngOnInit() {
    this.addElemsToRepliesList();
  }

  private addElemsToRepliesList(page = 0) {
    this.repliesSubscription = this.commentService.getAllReplies(this.commentId, page, this.repliesAmount)
      .subscribe((list: CommentsModel) => {
        this.repliesList = list.page.filter(item => item.status !== 'DELETED');
      });
  };

  public showReliesList(): void {
    this.showRelies = !this.showRelies;
  }

  public toggleReply(): void {
    this.showAddReply = !this.showAddReply;
  }

  public addReply(data): void {
    this.repliesList = [data, ...this.repliesList];
  }
}
