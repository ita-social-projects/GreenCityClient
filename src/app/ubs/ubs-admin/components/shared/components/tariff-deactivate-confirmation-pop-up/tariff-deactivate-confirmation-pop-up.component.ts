import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalTextComponent } from '../modal-text/modal-text.component';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { TariffsService } from 'src/app/ubs/ubs-admin/services/tariffs.service';

@Component({
  selector: 'app-tariff-deactivate-confirmation-pop-up',
  templateUrl: './tariff-deactivate-confirmation-pop-up.component.html',
  styleUrls: ['./tariff-deactivate-confirmation-pop-up.component.scss']
})
export class TariffDeactivateConfirmationPopUpComponent implements OnInit {
  public adminName: string;
  newDate: string;
  unsubscribe: Subject<any> = new Subject();
  courierName: string;
  courierEnglishName: string;
  stationNames: Array<string>;
  regionName: string;
  regionEnglishName: string;
  locationNames: Array<string>;
  locationEnglishNames: Array<string>;
  isRestore: boolean;
  isDeactivate: boolean;
  isDeactivatePopup = true;

  constructor(
    private tariffsService: TariffsService,
    private languageService: LanguageService,
    private localeStorageService: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<TariffDeactivateConfirmationPopUpComponent>
  ) {}

  ngOnInit(): void {
    this.courierName = this.modalData.courierNameUk ?? '';
    this.courierEnglishName = this.modalData.courierEnglishName ?? '';
    this.stationNames = this.modalData.stationNames ?? '';
    this.regionName = this.modalData.regionNameUk ?? '';
    this.regionEnglishName = this.modalData.regionEnglishName ?? '';
    this.isDeactivate = this.modalData.isDeactivate;
    this.locationNames = this.modalData.regionNameUk ?? '';
    this.locationEnglishNames = this.modalData.regionEnglishName ?? '';
    this.isRestore = this.modalData.isRestore;
    this.localeStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.unsubscribe)).subscribe((firstName) => {
      this.adminName = firstName;
    });
    this.setDate();
  }

  setDate(): void {
    const lang = this.languageService.getCurrentLanguage();
    this.newDate = this.tariffsService.setDate(lang);
  }

  public onCancelClick(): void {
    const matDialog = this.dialog.open(ModalTextComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        name: 'cancel',
        text: 'modal-text.cancel-message',
        action: 'modal-text.yes'
      }
    });
    matDialog.afterClosed().subscribe((data) => {
      if (data) {
        this.dialogRef.close(false);
      }
    });
  }

  public actionClick(): void {
    this.dialogRef.close(true);
  }
}
