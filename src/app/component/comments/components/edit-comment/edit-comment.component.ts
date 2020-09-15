import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.scss']
})
export class EditCommentComponent {

  constructor() { }

  public editIcon = 'assets/img/comments/edit.png';
  @Output() isEditing = new EventEmitter<boolean>();

  public editComments() {
      this.isEditing.emit();
  }
}
