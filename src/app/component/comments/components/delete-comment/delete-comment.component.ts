import { Component, Output, Input, EventEmitter } from '@angular/core';
import { CommentsService } from '../../services/comments.service';

@Component({
  selector: 'app-delete-comment',
  templateUrl: './delete-comment.component.html',
  styleUrls: ['./delete-comment.component.scss']
})
export class DeleteCommentComponent {
  @Input() public element;
  @Input() public elements;
  @Output() public elementsList = new EventEmitter();
  public deleteIcon = 'assets/img/comments/delete.png';

  constructor(private commentsService: CommentsService) { }

  public deleteComment(): void {
    this.commentsService.deleteComments(this.element.id).subscribe(response => {
      if (response.status === 200) {
        this.elementsList.emit(this.elements.filter((item) => item.text !== this.element.text));
      }
    });
  }
}
