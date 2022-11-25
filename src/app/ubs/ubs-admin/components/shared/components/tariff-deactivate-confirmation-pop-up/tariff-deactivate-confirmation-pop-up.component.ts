import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalTextComponent } from '../modal-text/modal-text.component';

@Component({
  selector: 'app-tariff-deactivate-confirmation-pop-up',
  templateUrl: './tariff-deactivate-confirmation-pop-up.component.html',
  styleUrls: ['./tariff-deactivate-confirmation-pop-up.component.scss']
})
export class TariffDeactivateConfirmationPopUpComponent implements OnInit {
  public name: string;
  public datePipe = new DatePipe('ua');
  public newDate = this.datePipe.transform(new Date(), 'MMM dd, yyyy');
  unsubscribe: Subject<any> = new Subject();
  title: string;
  courierName: string;
  stationNames: Array<string>;
  regionNames: Array<string>;
  locationNames: Array<string>;
  action: string;

  constructor(
    private localeStorageService: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<TariffDeactivateConfirmationPopUpComponent>
  ) {}

  ngOnInit(): void {
    this.title = this.modalData.title;
    this.courierName = this.modalData.courierName ?? '';
    this.stationNames = this.modalData.stationNames ?? '';
    this.regionNames = this.modalData.regionName ?? '';
    this.locationNames = this.modalData.locationNames ?? '';
    this.action = this.modalData.action;
    this.localeStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.unsubscribe)).subscribe((firstName) => {
      this.name = firstName;
    });
  }

  public(): void {}

  public onNoClick(): void {
    const matDialogRef = this.dialog.open(ModalTextComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        name: 'cancel',
        text: 'modal-text.cancel-message',
        action: 'modal-text.yes'
      }
    });
    matDialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.dialogRef.close(false);
      }
    });
  }

  public actionClick(): void {
    this.dialogRef.close(true);
  }
}
