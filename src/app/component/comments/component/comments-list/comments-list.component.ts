import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { Subscription } from 'rxjs';
import { Validators, FormControl } from '@angular/forms';
import { CommentsDTO, CommentsModel } from '../../models/comments-model';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.scss']
})
export class CommentsListComponent implements OnInit {
  @Input() public elementsList: CommentsDTO[] = [];
  @Input() public dataType: string;
  @Input() public commentId: number;
  @Input() public config;
  @Input() public isLoggedIn: boolean;
  @Input() public userId: number;
  @Output() public changedList = new EventEmitter();
  public content: FormControl = new FormControl('', [Validators.required, Validators.maxLength(8000)]);
  public editIcon = 'assets/img/comments/edit.png';
  public cancelIcon = 'assets/img/comments/cancel-comment-edit.png';

  constructor(private commentService: CommentService) { }

  ngOnInit() {
  }

  public deleteComment(comments: CommentsDTO[]): void {
    this.elementsList = comments;
    this.changedList.emit(comments);
  }

  public isCommentEdited(element: CommentsDTO): boolean {
    return element.status === 'EDITED';
  }

  public onEdit(id: number): void {
    this.elementsList = this.elementsList.map(item => {
      item.isEdit = item.id === id && !item.isEdit;
      return item;
    });
  }

  public saveEditedComment(element: CommentsDTO): void {
    this.commentService.editComment(element.id, this.content).subscribe(
      () => this.content.reset());
    element.isEdit = false;
    element.text = this.content.value;
    element.status = 'EDITED';
  }

  public cancelEditedComment(element: CommentsDTO): void {
    element.isEdit = false;
  }
}
