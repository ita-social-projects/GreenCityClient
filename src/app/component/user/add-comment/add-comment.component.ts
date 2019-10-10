import {Component, OnInit} from '@angular/core';
import {Comment} from '../../../model/comment/comment';
import {Photo} from '../../../model/photo/photo';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent implements OnInit {
  comment: Comment = new Comment();

  constructor() {
  }

  ngOnInit() {
  }

  getListOfPhotos(photos: Photo[]) {
    this.comment.photos = photos;
  }
}
