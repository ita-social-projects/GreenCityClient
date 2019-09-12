import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {PlaceService} from '../../../service/place/place.service';
import {ModalService} from '../_modal/modal.service';

export interface DialogData {
  animal: string;
  name: string;
}

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'test-d',
  templateUrl: 'test.html',
  styleUrls: ['test.css'],
})
export class TestD {

  animal: string;
  name: string;

  constructor(public dialog: MatDialog) {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TestDialog, {
      width: '250px',
      data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

}

@Component({
  selector: 'test-dialog',
  templateUrl: 'test-dailog.html',
})
export class TestDialog {

  constructor(
    public dialogRef: MatDialogRef<TestDialog>,
    private modalService: ModalService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

}


/**  Copyright 2019 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license */
