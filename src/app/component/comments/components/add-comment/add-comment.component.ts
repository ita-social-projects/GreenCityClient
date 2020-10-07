import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent implements OnInit {
  @Output() public updateList = new EventEmitter();
  @Input() public commentId: number;
  public avatarImage = 'assets/img/comment-avatar.png';
  public addCommentForm: FormGroup = this.fb.group({
    content: ['', [Validators.required, Validators.maxLength(8000)]],
  });

  constructor(private commentsService: CommentsService,
              private fb: FormBuilder) { }

  ngOnInit() {
  }

  public onSubmit(): void {
    this.commentsService.addComment(this.commentId, this.addCommentForm).subscribe(
      () => {
        this.updateList.emit();
        this.addCommentForm.reset();
      }
    );
  }
}
