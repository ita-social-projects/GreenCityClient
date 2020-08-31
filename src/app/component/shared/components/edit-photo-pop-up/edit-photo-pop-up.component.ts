import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-photo-pop-up',
  templateUrl: './edit-photo-pop-up.component.html',
  styleUrls: ['./edit-photo-pop-up.component.scss']
})
export class EditPhotoPopUpComponent implements OnInit {
  public avatarImg: string;
  public cancelButton = './assets/img/profile/icons/cancel.svg';

  constructor(private matDialogRef: MatDialogRef<EditPhotoPopUpComponent>,
              private router: Router,
              @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.setuserAvatar();
  }

  private setuserAvatar() {
    this.avatarImg = this.data.img;
  }

  public closeEditPhoto(): void {
    this.matDialogRef.close();
  }
}
