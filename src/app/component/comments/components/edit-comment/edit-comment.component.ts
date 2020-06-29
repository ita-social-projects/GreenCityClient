import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.scss']
})
export class EditCommentComponent implements OnInit {

  constructor() { }

  public editIcon = 'assets/img/comments/edit.png';

  ngOnInit() {
  }

}
