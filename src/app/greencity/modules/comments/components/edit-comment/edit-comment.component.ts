import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.scss']
})
export class EditCommentComponent {
  editIcon = 'assets/img/comments/edit.png';
  @Output() isEditing = new EventEmitter<boolean>();

  editComments() {
    this.isEditing.emit();
  }
}
