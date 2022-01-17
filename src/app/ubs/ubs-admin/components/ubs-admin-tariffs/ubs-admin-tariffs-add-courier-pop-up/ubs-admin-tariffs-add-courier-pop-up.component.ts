import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ubs-admin-tariffs-add-courier-pop-up',
  templateUrl: './ubs-admin-tariffs-add-courier-pop-up.component.html',
  styleUrls: ['./ubs-admin-tariffs-add-courier-pop-up.component.scss']
})
export class UbsAdminTariffsAddCourierPopUpComponent implements OnInit {
  courierForm: FormGroup;
  courierExist = false;
  name: string;
  unsubscribe: Subject<any> = new Subject();
  datePipe = new DatePipe('ua');
  newDate = this.datePipe.transform(new Date(), 'MMM dd, yyyy');
  public icons = {
    close: '.././assets/img/ubs-tariff/bigClose.svg'
  };
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UbsAdminTariffsAddCourierPopUpComponent>,
    private localeStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.courierForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      englishName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]]
    });
    this.localeStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.unsubscribe)).subscribe((firstName) => {
      this.name = firstName;
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
