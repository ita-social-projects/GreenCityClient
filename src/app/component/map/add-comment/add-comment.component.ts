import {Component, Inject, OnInit} from '@angular/core';
import {Comment} from '../../../model/comment/comment';
import {Photo} from '../../../model/photo/photo';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CommentService} from '../../../service/comment/comment.service';
import {Estimate} from '../../../model/estimate/estimate';


@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent implements OnInit {
  comment: Comment = new Comment();
  estimate: Estimate = new Estimate();
  countOfPhotos: number;
  photoLoadingStatus = false;
  placeId: number;

  constructor(private commentService: CommentService,
              private dialogRef: MatDialogRef<AddCommentComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.placeId = data.id;
    this.countOfPhotos = data.listOfPhoto;
  }

  ngOnInit() {
  }

  getListOfPhotos(photos: Photo[]) {
    this.comment.photos = photos;
  }

  changeLoadingStatus() {
    this.photoLoadingStatus = !this.photoLoadingStatus;
  }

  onSubmit() {
    this.comment.estimate = this.estimate;
    this.commentService.saveCommentByPlaceId(this.placeId, this.comment);
    this.dialogRef.close();
  }
}
