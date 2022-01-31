import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ubs-admin-tariffs-add-name-pop-up',
  templateUrl: './ubs-admin-tariffs-add-name-pop-up.component.html',
  styleUrls: ['./ubs-admin-tariffs-add-name-pop-up.component.scss']
})
export class UbsAdminTariffsAddNamePopUpComponent implements OnInit {
  courierForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
    englishName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]]
  });

  stationForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
    englishName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]]
  });

  courierExist = false;
  stationExist = false;
  name: string;
  unsubscribe: Subject<any> = new Subject();
  datePipe = new DatePipe('ua');
  newDate = this.datePipe.transform(new Date(), 'MMM dd, yyyy');
  constructor(
    private fb: FormBuilder,
    private localeStorageService: LocalStorageService,
    public dialogRef: MatDialogRef<UbsAdminTariffsAddNamePopUpComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      headerText: string;
      template: TemplateRef<any>;
    }
  ) {}

  ngOnInit(): void {
    this.localeStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.unsubscribe)).subscribe((firstName) => {
      this.name = firstName;
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
