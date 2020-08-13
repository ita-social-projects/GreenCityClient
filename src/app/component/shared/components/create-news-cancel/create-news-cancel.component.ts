import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-news-cancel',
  templateUrl: './create-news-cancel.component.html',
  styleUrls: ['./create-news-cancel.component.scss']
})
export class CreateNewsCancelComponent implements OnInit {
  private currentPage: string;

  constructor(private matDialogRef: MatDialogRef<CreateNewsCancelComponent>,
              private router: Router,
              @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.setCurrentPage();
  }

  private setCurrentPage(){
    this.currentPage = this.data.currentPage;
  }

  private closeCancelPopup(): void {
    this.matDialogRef.close();
  }

  private moveToNewsList(): void {
    this.currentPage === 'eco news' ? this.router.navigate(['/news']) : this.router.navigate(['/profile']);
    this.closeCancelPopup();
  }
}
