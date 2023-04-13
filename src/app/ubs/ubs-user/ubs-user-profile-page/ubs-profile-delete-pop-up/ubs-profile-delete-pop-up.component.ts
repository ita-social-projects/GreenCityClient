import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-ubs-profile-delete-pop-up',
  templateUrl: './ubs-profile-delete-pop-up.component.html',
  styleUrls: ['./ubs-profile-delete-pop-up.component.scss']
})
export class UbsProfileDeletePopUpComponent {
  isAddressDelete: boolean;
  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.isAddressDelete = this.data.isAddressDelete;
  }
}
