import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { errorType } from '@global-user/models/error-type.model';

@Component({
  selector: 'app-input-error',
  templateUrl: './input-error.component.html',
  styleUrls: ['./input-error.component.scss']
})
export class InputErrorComponent implements OnInit {
  @Input() public formElement: FormControl;
  @Input() public isEvent: boolean;
  @Input() public date: boolean;
  @Input() public numberDate: boolean;

  public errorMessage: string | undefined;
  private validationErrors = {
    required: 'input-error.required',
    minlength: 'input-error.min-length-short',
    maxlength: 'input-error.max-length',
    maxlengthTitle: 'input-error.max-length-title',
    minlengthDescription: 'input-error.min-length-description',
    maxlengthDescription: 'input-error.max-length-description',
    maxlengthService: 'ubs-tariffs-add-service.error_service_name_content',
    maxlengthServiceDescription: 'ubs-tariffs-add-service.error_content',
    pattern: 'input-error.pattern',
    maxlengthEventName: 'create-event.max-length-title',
    requiredEventName: 'create-event.title-required',
    requiredEventDate: 'create-event.date-required',
    negativeNumberValue: 'ubs-tariffs-add-service.negative_number_value',
    datepickerNotCorrect: 'create-event.datepicker-not-correct',
    datepickerAndEventDateNotCorrect: 'create-event.datepicker-not-correct-date-required'
  };

  ngOnInit(): void {
    this.getType();
    this.formElement.valueChanges.pipe().subscribe(() => {
      this.getType();
    });
  }

  getType(): void {
    Object.values(errorType).forEach((err) => {
      if (this.formElement.errors?.[err]) {
        switch (err) {
          case errorType.pattern:
            this.errorMessage = this.getMinValueErrorMessage(this.formElement.errors.pattern.actualValue);
            break;
          case errorType.minlength:
            this.errorMessage = this.getMinlengthErrorMessage(this.formElement.errors.minlength.requiredLength);
            break;
          case errorType.maxlength:
            this.errorMessage = this.getMaxlengthErrorMessage(this.formElement.errors.maxlength.requiredLength, this.isEvent);
            break;
          default:
            if (this.isEvent) {
              this.errorMessage = this.getRequiredErrorMessage();
              if (this.numberDate) {
                this.errorMessage = this.validationErrors.datepickerAndEventDateNotCorrect;
              }
              break;
            }
            this.errorMessage = this.validationErrors[err];
        }
      }
    });

    if (this.numberDate && !this.date) {
      this.errorMessage = this.validationErrors.datepickerNotCorrect;
    }
  }

  private getRequiredErrorMessage(): string {
    return this.date ? this.validationErrors.requiredEventDate : this.validationErrors.requiredEventName;
  }

  private getMinValueErrorMessage(actualValue: number): string {
    if (actualValue < 1) {
      return this.validationErrors.negativeNumberValue;
    }
  }

  getMinlengthErrorMessage(minlength: number): string {
    return this.formElement.value.length ? this.validationErrors.minlength : this.validationErrors.minlengthDescription;
  }

  getMaxlengthErrorMessage(maxlength: number, isEvent: boolean): string {
    if (isEvent) {
      return this.validationErrors.maxlengthEventName;
    }

    switch (maxlength) {
      case 30:
        return this.validationErrors.maxlengthService;
      case 70:
        return this.validationErrors.maxlengthTitle;
      case 255:
        return this.validationErrors.maxlengthServiceDescription;
      case 63206:
        return this.validationErrors.maxlengthDescription;
      default:
        return this.validationErrors.maxlength;
    }
  }
}
