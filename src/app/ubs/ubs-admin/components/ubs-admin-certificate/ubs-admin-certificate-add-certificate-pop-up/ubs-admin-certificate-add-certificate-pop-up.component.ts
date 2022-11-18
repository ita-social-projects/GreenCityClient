import { Component, OnInit, OnDestroy } from '@angular/core';
import { CreateCertificate } from '../../../models/ubs-admin.interface';
import { Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminCertificateService } from '../../../services/admin-certificate.service';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Masks, Patterns } from 'src/assets/patterns/patterns';

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

  private destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private adminCertificateService: AdminCertificateService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UbsAdminCertificateAddCertificatePopUpComponent>
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.addCertificateForm = this.fb.group({
      code: new FormControl('', [Validators.required, Validators.pattern(this.certificatePattern)]),
      monthCount: new FormControl('', [Validators.required, Validators.pattern(Patterns.sertificateMonthCount)]),
      initialPointsValue: new FormControl('', [Validators.required, Validators.pattern(Patterns.sertificateInitialValue)])
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

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
