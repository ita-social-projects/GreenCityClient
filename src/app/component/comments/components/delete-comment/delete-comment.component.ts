import { Component, OnInit, Input } from '@angular/core';
import { CommentsService } from '../../services/comments.service';

@Component({
  selector: 'app-delete-comment',
  templateUrl: './delete-comment.component.html',
  styleUrls: ['./delete-comment.component.scss']
})
export class DeleteCommentComponent {

  constructor(private commentsService: CommentsService) { }

  public deleteIcon = 'assets/img/comments/delete.png';
  @Input() public element;
  @Input() public elements;
  @Input() public index;
  public deleteComment(): void {
    this.elements.splice(this.index, 1);
    this.commentsService.deleteComments(this.element.id).subscribe();
  }

}
