import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.scss']
})
export class EditCommentComponent implements OnInit {

  constructor(private commentsService: CommentsService,
              private fb: FormBuilder) { }

  public editIcon = 'assets/img/comments/edit.png';
  @Input() public elements;
  @Input() public element;
  @Output() isEditing = new EventEmitter<boolean>();
  @Input() public editCommentForm: FormControl;

  ngOnInit() {
  }

  private editComments(event) {
    console.log(this.element, this.elements);
    
    //this.elements = this.elements.filter((item) => item.text === this.element.text);
    console.log(this.element, this.elements);
    
      this.isEditing.emit();
   
    // this.commentsService.editComment(this.element.id, this.editCommentForm).subscribe(response => {
    //   console.log(response);
    // });
    console.log(this.commentsService.isEditing, this.isEditing);
  }

}
