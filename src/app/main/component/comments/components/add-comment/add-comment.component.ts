import { take } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent implements OnInit {
  @Input() public entityId: number;
  @Input() public commentId: number;
  @Output() public updateList = new EventEmitter();

  public userInfo;
  public avatarImage: string;
  public firstName: string;
  public addCommentForm: FormGroup = this.fb.group({
    content: ['', [Validators.required, Validators.maxLength(8000), this.noSpaceValidator]]
  });
  public commentHtml: string;
  public replyMaxLength = 8000;

  constructor(private commentsService: CommentsService, private fb: FormBuilder, private profileService: ProfileService) {}

  ngOnInit() {
    this.getUserInfo();
  }

  noSpaceValidator(control: FormControl): ValidationErrors {
    return (control.value || '').trim().length ? null : { spaces: true };
  }

  public getUserInfo(): void {
    this.profileService.getUserInfo().subscribe((item) => {
      this.firstName = item.name;
      this.avatarImage = item.profilePicturePath;
    });
  }

  setContent(data: { text: string; innerHTML: string }) {
    this.addCommentForm.controls.content.setValue(data.text);
    this.commentHtml = data.innerHTML;
  }

  public onSubmit(): void {
    this.commentsService
      .addComment(this.entityId, this.commentHtml, this.commentId)
      .pipe(take(1))
      .subscribe(() => {
        this.updateList.emit();
        this.addCommentForm.reset();
        this.addCommentForm.controls.content.setValue('');
        this.commentHtml = '';
      });
  }
}
