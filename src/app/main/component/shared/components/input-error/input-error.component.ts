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
    pattern: 'input-error.pattern'
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
          case errorType.minlength:
            this.errorMessage = this.getMinlengthErrorMessage(this.formElement.errors.minlength.requiredLength);
            break;
          case errorType.maxlength:
            this.errorMessage = this.getMaxlengthErrorMessage(this.formElement.errors.maxlength.requiredLength);
            break;
          default:
            this.errorMessage = this.validationErrors[err];
        }
      }
    });
  }

  getMinlengthErrorMessage(minlength: number): string {
    return minlength === 27 ? this.validationErrors.minlengthDescription : this.validationErrors.minlength;
  }

  getMaxlengthErrorMessage(maxlength: number): string {
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
