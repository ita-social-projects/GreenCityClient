import { Component, OnInit } from '@angular/core';
import { COMMENTS_IMAGES } from '@images/comments/comments-images';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent {

  constructor() { }

  public avatarImage = COMMENTS_IMAGES;

}
