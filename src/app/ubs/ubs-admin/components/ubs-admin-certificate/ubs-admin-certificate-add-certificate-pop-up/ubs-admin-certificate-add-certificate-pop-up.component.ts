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
  monthCountValid: boolean;
  pointsValid: boolean;

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
    if (/^[0]+$/.test(newValue)) {
      this.monthCountValid = true;
    } else {
      this.monthCountValid = false;
    }
  }

  valueChangePointsValue(newValue: string) {
    if (/^[0]+$/.test(newValue)) {
      this.pointsValid = true;
    } else {
      this.pointsValid = false;
    }
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
