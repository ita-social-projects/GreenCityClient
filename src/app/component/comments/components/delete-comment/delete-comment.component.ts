import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import { CommentsDTO } from '../../models/comments-model';

@Component({
  selector: 'app-delete-comment',
  templateUrl: './delete-comment.component.html',
  styleUrls: ['./delete-comment.component.scss']
})
export class DeleteCommentComponent {
  @Input() public element: CommentsDTO;
  @Output() public elementsList = new EventEmitter();
  public deleteIcon = 'assets/img/comments/delete.png';

  constructor(private commentsService: CommentsService) { }

  public deleteComment(): void {
    this.commentsService.deleteComments(this.element.id).subscribe(response => {
      if (response.status === 200) {
        this.elementsList.emit();
      }
    });
  }
}
