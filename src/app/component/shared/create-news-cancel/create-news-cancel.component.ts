import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-news-cancel',
  templateUrl: './create-news-cancel.component.html',
  styleUrls: ['./create-news-cancel.component.scss']
})
export class CreateNewsCancelComponent implements OnInit {

  constructor(private matDialogRef: MatDialogRef<CreateNewsCancelComponent>,
              private router: Router) { }

  ngOnInit() {
  }

  private closeCancelPopup(): void {
    this.matDialogRef.close();
  }

  private moveToNewsList(): void {
    this.router.navigate(['/news']);
    this.closeCancelPopup();
  }
}
