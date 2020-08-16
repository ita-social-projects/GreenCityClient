import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-news-cancel',
  templateUrl: './cancel-pop-up.component.html',
  styleUrls: ['./cancel-pop-up.component.scss']
})
export class CancelPopUpComponent implements OnInit {
  public currentPage: string;

  constructor(private matDialogRef: MatDialogRef<CancelPopUpComponent>,
              private router: Router,
              @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.setCurrentPage();
  }

  private setCurrentPage() {
    this.currentPage = this.data.currentPage;
  }

  public closeCancelPopup(): void {
    this.matDialogRef.close();
  }

  public moveToNewsList(): void {
    this.currentPage === 'eco news' ? this.router.navigate(['/news']) : this.router.navigate(['/profile']);
    this.closeCancelPopup();
  }
}
