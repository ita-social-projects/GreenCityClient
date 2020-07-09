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

  public deleteComment(): void {
    this.commentsService.deleteComments(this.element.id).subscribe(response => {
      if (response.status === 200) {
        this.elements = this.elements.filter((item) => item.text !== this.element.text);
      }
    });
  }

}
