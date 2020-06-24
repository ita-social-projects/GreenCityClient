import { Component, OnInit, Input } from '@angular/core';
import { CommentsService } from '../../services/comments.service';

@Component({
  selector: 'app-comment-body',
  templateUrl: './comment-body.component.html',
  styleUrls: ['./comment-body.component.scss']
})
export class CommentBodyComponent {

  constructor(private commentsService: CommentsService) { }
  @Input() public elements = [];

}
