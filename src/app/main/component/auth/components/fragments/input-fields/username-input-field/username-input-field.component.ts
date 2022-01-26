import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { ValidatorRegExp } from '@global-auth/sign-up/sign-up.validator';
import { PopUpViewService } from '@auth-service/pop-up/pop-up-view.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-username-input-field',
  templateUrl: './username-input-field.component.html',
  styleUrls: ['./username-input-field.component.scss'],
  viewProviders: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UsernameInputFieldComponent),
      multi: true
    }
  ]
})
export class UsernameInputFieldComponent implements OnInit, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  public backEndError: string;
  public firstNameErrorMessageBackEnd: string;
  public userNameInputForm: FormGroup;
  public nameField: AbstractControl;
  public userNameValue: string;

  constructor(private popUpViewService: PopUpViewService) {}

  ngOnInit(): void {
    this.popUpViewService.firstNameBackendErrorSubject
      .pipe(takeUntil(this.destroy))
      .subscribe((value) => (this.firstNameErrorMessageBackEnd = value));
    this.userNameInputForm = new FormGroup({
      firstName: new FormControl('', [Validators.required])
    });
    this.userNameInputForm.setValidators(ValidatorRegExp('firstName'));
    this.nameField = this.userNameInputForm.get('firstName');
  }

  public setError(): void {
    this.firstNameErrorMessageBackEnd = null;
    this.backEndError = null;
    this.userNameValue = this.nameField.value;
    this.nameField.markAsTouched();
    if (this.nameField.valid && this.userNameInputForm.touched) {
      this.popUpViewService.setUserNameInputField(true);
    } else {
      this.popUpViewService.setUserNameInputField(false);
    }
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
