import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { LanguageService } from 'src/app/main/i18n/language.service';

@Component({
  selector: 'app-deleting-profile-reason-pop-up',
  templateUrl: './deleting-profile-reason-pop-up.component.html',
  styleUrls: ['./deleting-profile-reason-pop-up.component.scss']
})
export class DeletingProfileReasonPopUpComponent implements OnInit, OnDestroy {
  reasonForm: FormGroup;
  reasons: Reason[] = deleteProfileReasons;
  ownReasonMaxLength = 255;
  private $destroy: Subject<void> = new Subject();

  get reason() {
    return this.reasonForm.controls.reason;
  }

  get ownReasonText() {
    return this.reasonForm.controls?.ownReasonText;
  }

  constructor(
    public dialogRef: MatDialogRef<DeletingProfileReasonPopUpComponent>,
    private languageService: LanguageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.reasonForm = this.fb.group({ reason: new FormControl('', Validators.required) });

    this.reason.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.$destroy)).subscribe(() => {
      if (this.reason.value === 'other' && !this.ownReasonText) {
        this.reasonForm.addControl(
          'ownReasonText',
          new FormControl('', [Validators.required, Validators.maxLength(this.ownReasonMaxLength)])
        );
      } else if (this.reason.value !== 'other' && this.ownReasonText) {
        this.reasonForm.removeControl('ownReasonText');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    this.dialogRef.close({
      reason: this.reason.value === 'other' ? this.ownReasonText.value : this.getLangValue(this.reason.value.ua, this.reason.value.en)
    });
  }

  getLangValue(uaValue: string, enValue: string): string {
    return this.languageService.getLangValue(uaValue, enValue) as string;
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }
}

interface Reason {
  id: number;
  ua: string;
  en: string;
}

const deleteProfileReasons: Reason[] = [
  {
    id: 0,
    ua: 'Причина 1',
    en: 'Reason 1'
  },
  {
    id: 1,
    ua: 'Причина 2',
    en: 'Reason 2'
  },
  {
    id: 2,
    ua: 'Причина 3',
    en: 'Reason 3'
  },
  {
    id: 3,
    ua: 'Причина 4',
    en: 'Reason 4'
  },
  {
    id: 4,
    ua: 'Не хочу вказувати',
    en: "Do'nt want to specify"
  }
];
