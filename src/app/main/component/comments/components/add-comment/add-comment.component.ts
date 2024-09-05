import { take } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { AddedCommentDTO } from 'src/app/main/component/comments/models/comments-model';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent implements OnInit {
  @Input() public entityId: number;
  @Input() public commentId: number;
  @Output() public updateList = new EventEmitter<AddedCommentDTO>();
  avatarImage: string;
  firstName: string;
  addCommentForm: FormGroup = this.fb.group({
    content: ['', [Validators.required, Validators.maxLength(8000), this.noSpaceValidator]]
  });
  commentHtml: string;

  constructor(
    private commentsService: CommentsService,
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.getUserInfo();
  }

  noSpaceValidator(control: FormControl): ValidationErrors {
    return (control.value || '').trim().length ? null : { spaces: true };
  }

  getUserInfo(): void {
    this.profileService.getUserInfo().subscribe((item) => {
      this.firstName = item.name;
      this.avatarImage = item.profilePicturePath;
    });
  }

  setContent(data: { text: string; innerHTML: string }) {
    alert(data.text);
    this.addCommentForm.controls.content.setValue(data.text);
    this.commentHtml = data.innerHTML;
  }

  onSubmit(): void {
    this.commentsService
      .addComment(this.entityId, this.commentHtml, this.commentId)
      .pipe(take(1))
      .subscribe((comment: AddedCommentDTO) => {
        this.updateList.emit(comment);
        this.addCommentForm.reset();
        this.addCommentForm.controls.content.setValue('');
        this.commentHtml = '';
      });
  }
}
