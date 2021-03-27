import { Component, Input, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-ubs-input-error',
  templateUrl: './ubs-input-error.component.html'
})
export class UBSInputErrorComponent implements OnChanges {
  @Input() public controlName: string;
  @Input() public formElement: FormControl;
  @Input() public certificateFieldValue: string;
  @Input() public firstNameFieldValue: string;
  @Input() public lastNameFieldValue: string;
  @Input() public emailFieldValue: string;
  @Input() public phoneNumberFieldValue: string;
  @Input() public streetFieldValue: string;
  @Input() public houseNumberFieldValue: string;

  public errorMessage = '';
  private getErrorMsg = {
    required: () => 'Це поле є обов\'язкове до заповнення',
    email: () => this.emailFieldValue ? 'Введіть коректний email' : 'Це поле  обов\'язкове до заповнення',
    minlength: () => this.phoneNumberFieldValue ? 'Введіть номер телефону повністю' : 'Мінімальна кількість символів: 3',
    maxlength: () => 'Перевищена максимальна кількість символів',
    pattern: () => 'Поле містить заборонені символи'
  };

  constructor() {}

  ngOnChanges() {
    this.getType();
  }

  private getType() {
    Object.keys(this.formElement.errors).forEach(error => {
      return this.errorMessage = this.getErrorMsg[error]();
    });
  }
}
