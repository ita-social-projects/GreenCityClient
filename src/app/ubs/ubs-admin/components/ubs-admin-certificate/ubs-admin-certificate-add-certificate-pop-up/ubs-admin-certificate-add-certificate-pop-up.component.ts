import { Component, OnInit, OnDestroy } from '@angular/core';
import { CreateCertificate } from '../../../models/ubs-admin.interface';
import { Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminCertificateService } from '../../../services/admin-certificate.service';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ubs-admin-certificate-add-certificate-pop-up',
  templateUrl: './ubs-admin-certificate-add-certificate-pop-up.component.html',
  styleUrls: ['./ubs-admin-certificate-add-certificate-pop-up.component.scss']
})
export class UbsAdminCertificateAddCertificatePopUpComponent implements OnInit, OnDestroy {
  certificate: CreateCertificate;
  private destroy: Subject<boolean> = new Subject<boolean>();
  addCertificateForm: FormGroup;
  certificatePattern = /(?!0000)\d{4}-(?!0000)\d{4}/;
  certificateMask = '0000-0000';

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
      monthCount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{1,2}$')]),
      points: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{2,4}$')])
    });
  }

  createCertificate() {
    const { code, monthCount, points } = this.addCertificateForm.value;
    this.certificate = {
      code,
      monthCount,
      points
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
