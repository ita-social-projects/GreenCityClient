import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';
import { CommentsDTO } from '../../models/comments-model';

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
  public likeImg = 'assets/img/comments/like.png';

  constructor(private commentsService: CommentsService) { }

  ngOnInit() {
  }

  public deleteComment(): void {
    this.changedList.emit();
  }

  public isCommentEdited(element: CommentsDTO): boolean {
    return element.status === 'EDITED';
  }

  public saveEditedComment(element: CommentsDTO): void {
    this.commentsService.editComment(element.id, this.content).subscribe(
      () => this.content.reset());
    element.isEdit = false;
    element.text = this.content.value;
    element.status = 'EDITED';
  }

  public cancelEditedComment(element: CommentsDTO): void {
    element.isEdit = false;
  }

  public changeCounter(counter: number, id: number, key: string): void {
    this.elementsList = this.elementsList.map(item => {
      if (item.id === id) {
        item[key] = counter;
      }
      return item;
    });
  }

  public showElements(id: number, key: string): void {
    this.elementsList = this.elementsList.map(item => {
      item[key] = item.id === id && !item[key];
      return item;
    });
  }
}
