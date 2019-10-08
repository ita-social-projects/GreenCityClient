import {Component, Inject, OnInit} from '@angular/core';
import {Comment} from '../../../model/comment/comment';
import {Photo} from '../../../model/photo/photo';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent implements OnInit {
  comment: Comment = new Comment();
  countOfPhotos: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.countOfPhotos = data;
  }

  ngOnInit() {
  }

  getListOfPhotos(photos: Photo[]) {
    this.comment.photos = photos;
  }
}
