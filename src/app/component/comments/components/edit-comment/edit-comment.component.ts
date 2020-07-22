import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.scss']
})
export class EditCommentComponent {

  constructor(private commentsService: CommentsService,
              private fb: FormBuilder) { }

  public editIcon = 'assets/img/comments/edit.png';
  @Output() isEditing = new EventEmitter<boolean>();

  private editComments() {
      this.isEditing.emit();
  }

}
