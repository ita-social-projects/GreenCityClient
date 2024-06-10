import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-friends-list-pop-up',
  templateUrl: './friends-list-pop-up.component.html',
  styleUrls: ['./friends-list-pop-up.component.scss']
})
export class FriendsListPopUpComponent {
  public closeButton = './assets/img/profile/icons/cancel.svg';

  constructor(
    public matDialogRef: MatDialogRef<FriendsListPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  onClose() {
    this.matDialogRef.close();
  }
}
