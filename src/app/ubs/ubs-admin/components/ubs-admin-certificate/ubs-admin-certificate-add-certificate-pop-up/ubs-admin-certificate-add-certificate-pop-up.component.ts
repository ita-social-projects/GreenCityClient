import { Component, OnInit, OnDestroy } from '@angular/core';
import { CreateCertificate } from '../../../models/ubs-admin.interface';
import { Subject, Subscription } from 'rxjs';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminCertificateService } from '../../../services/admin-certificate.service';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Masks, Patterns } from 'src/assets/patterns/patterns';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Component({
  selector: 'app-ubs-admin-certificate-add-certificate-pop-up',
  templateUrl: './ubs-admin-certificate-add-certificate-pop-up.component.html',
  styleUrls: ['./ubs-admin-certificate-add-certificate-pop-up.component.scss']
})
export class UbsAdminCertificateAddCertificatePopUpComponent implements OnInit, OnDestroy {
  certificate: CreateCertificate;
  addCertificateForm: FormGroup;
  certificatePattern = Patterns.serteficatePattern;
  certificateMask = Masks.certificateMask;
  monthCountDisabled: boolean;
  pointsValueDisabled: boolean;
  public langChangeSub: Subscription;

  private destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private adminCertificateService: AdminCertificateService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private localStorageService: LocalStorageService,
    public dialogRef: MatDialogRef<UbsAdminCertificateAddCertificatePopUpComponent>
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.subscribeToLangChange();
    this.bindLang(this.localStorageService.getCurrentLanguage());
  }

  private bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }

  private subscribeToLangChange(): void {
    this.langChangeSub = this.localStorageService.languageSubject.subscribe(this.bindLang.bind(this));
  }

  public initForm(): void {
    this.addCertificateForm = this.fb.group({
      code: new FormControl('', [Validators.required, Validators.pattern(this.certificatePattern)]),
      monthCount: new FormControl('', [
        Validators.required,
        Validators.pattern(Patterns.sertificateMonthCount),
        Validators.max(12),
        Validators.min(1)
      ]),
      initialPointsValue: new FormControl('', [
        Validators.required,
        Validators.pattern(Patterns.sertificateInitialValue),
        Validators.min(1),
        Validators.max(9999.99)
      ])
    });
  }

  valueChangeMonthCount(newValue: string) {
    this.monthCountDisabled = /^0+$/.test(newValue);
  }

  valueChangePointsValue(newValue: string) {
    this.pointsValueDisabled = /^0+$/.test(newValue);
  }

  createCertificate() {
    const { code, monthCount, initialPointsValue } = this.addCertificateForm.value;
    this.certificate = {
      code,
      monthCount,
      initialPointsValue
    };
    this.adminCertificateService
      .createCertificate(this.certificate)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.dialogRef.close({});
      });
  }

  getErrorMessage(abstractControl: AbstractControl, name?: string): string {
    const controlInvalid = !!abstractControl.errors.pattern || !!abstractControl.errors.max || !!abstractControl.errors.min;

    if (abstractControl.errors.required) {
      return 'add-new-certificate.field-not-empty';
    }

    if (!!abstractControl.errors.pattern && name === 'code') {
      return 'add-new-certificate.сertificate-field-format';
    }

    if (controlInvalid && name === 'initialPointsValue') {
      return 'add-new-certificate.discount-field-format';
    }

    if (controlInvalid && name === 'monthCount') {
      return 'add-new-certificate.duration-field-format';
    }
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.unsubscribe();
    this.langChangeSub.unsubscribe();
  }
}
