import {Component, OnInit} from '@angular/core';
import {CommentAdminDto} from '../../../model/comment/comment-admin-dto.model';
import {FeedbackService} from '../../../service/feedbacksAdmin/feedback.service';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {ConfirmationDialogService} from '../confirm-modal/confirmation-dialog-service.service';
import {NgFlashMessageService} from 'ng-flash-messages';
import {DialogPhotoComponent} from './dialog-photo/dialog-photo.component';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.css']
})
export class FeedbacksComponent implements OnInit {

  displayedColumns: string[] = ['place', 'text', 'attachments', 'delete'];
  pageSize: number;
  page: number;
  totalItems: number;
  comments: CommentAdminDto[];
  dataSource = new MatTableDataSource<CommentAdminDto>();
  truncFlag = false;

  constructor(private commentService: FeedbackService, private confirmationDialogService: ConfirmationDialogService,
              private ngFlashMessageService: NgFlashMessageService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.getCommentsByPage();
  }

  changePage(event: any) {
    this.commentService.changePage(event.page - 1);
    this.commentService.pageSize = this.pageSize;
    this.getCommentsByPage();
  }

  getCommentsByPage() {
    this.commentService.getCommentsByPage().subscribe(res => {
      this.comments = res.page;
      this.page = this.commentService.page;
      this.totalItems = res.totalElements;
      this.dataSource.data = this.comments;
      this.pageSize = this.commentService.pageSize;
    });
  }

  confirmDelete(id: number, commentName: string) {
    this.confirmationDialogService.confirm('Delete', `Do you really want to delete
    comment of "${commentName}" ?`)
      .then((confirmed) => {
        if (confirmed) {
          this.delete(id);
        }
      });
  }

  delete(id: number) {
    this.commentService.delete(id).subscribe(
      () => {
        this.showMessage(`Comment was <b>DELETED</b>!`, 'success');
        this.getCommentsByPage();
      },
      error => {
        this.showMessage(`ERROR! Comment was not <b>DELETED</b>!. Please try again`, 'danger');
      }
    );
  }

  showMessage(message: string, messageType: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [message],
      dismissible: true,
      timeout: 3000,
      type: messageType,
    });
  }

  changeVisability(id: string, id2: string) {
    document.getElementById(id).hidden = !document.getElementById(id).hidden;
    document.getElementById(id2).hidden = !document.getElementById(id2).hidden;
  }

  openDialog(photoUrl: string): void {
    const dialogRef = this.dialog.open(DialogPhotoComponent, {
      width: '55%',
      height: '65%',
      hasBackdrop: true,
      data: photoUrl
    });
  }
}
