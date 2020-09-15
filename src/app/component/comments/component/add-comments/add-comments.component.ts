import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { CommentsDTO } from '../../models/comments-model';

@Component({
  selector: 'app-add-comments',
  templateUrl: './add-comments.component.html',
  styleUrls: ['./add-comments.component.scss']
})
export class AddCommentsComponent implements OnInit {
  @Output() public elementsList = new EventEmitter();
  @Input() public commentId: number;
  public avatarImage = 'assets/img/comment-avatar.png';
  public addCommentForm: FormGroup = this.fb.group({
    content: ['', [Validators.required, Validators.maxLength(8000)]],
  });
  
  constructor(private commentService: CommentService,
              private fb: FormBuilder) { }

  ngOnInit() {
  }

  public onSubmit(): void {
    this.commentService.addComment(this.commentId, this.addCommentForm).subscribe(
      (successRes: CommentsDTO) => {
        this.elementsList.emit(successRes);
        this.addCommentForm.reset();
      }
    );
  }
}
