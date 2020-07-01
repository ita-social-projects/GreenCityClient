import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-delete-comment',
  templateUrl: './delete-comment.component.html',
  styleUrls: ['./delete-comment.component.scss']
})
export class DeleteCommentComponent implements OnInit {

  constructor() { }

  public deleteIcon = 'assets/img/comments/delete.png';

  ngOnInit() {
  }

}
