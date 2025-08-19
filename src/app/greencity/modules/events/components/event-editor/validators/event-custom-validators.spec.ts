import { FormControl, FormGroup } from '@angular/forms';
import { customTextValidator, locationOrOnlineLinkValidator, dateFormatValidator } from './event-custom-validators';

describe('Event Custom Validators', () => {
  describe('customTextValidator', () => {
    let control: FormControl;

    beforeEach(() => {
      control = new FormControl();
    });

    it('should return invalid error when control value is null', () => {
      control.setValue(null);
      const result = customTextValidator(control);
      expect(result).toEqual({ invalid: true });
    });

    it('should return invalid error when control value is undefined', () => {
      control.setValue(undefined);
      const result = customTextValidator(control);
      expect(result).toEqual({ invalid: true });
    });

    it('should return invalid error when control value is empty string', () => {
      control.setValue('');
      const result = customTextValidator(control);
      expect(result).toEqual({ invalid: true });
    });

    it('should return invalid error when value has leading spaces', () => {
      control.setValue(' valid text content');
      const result = customTextValidator(control);
      expect(result).toEqual({ invalid: true });
    });

    it('should return invalid error when value has trailing spaces', () => {
      control.setValue('valid text content ');
      const result = customTextValidator(control);
      expect(result).toEqual({ invalid: true });
    });

    it('should return invalid error when value has both leading and trailing spaces', () => {
      control.setValue(' valid text content ');
      const result = customTextValidator(control);
      expect(result).toEqual({ invalid: true });
    });

    it('should return invalid error when value has 3 or more consecutive spaces', () => {
      control.setValue('valid text   content');
      const result = customTextValidator(control);
      expect(result).toEqual({ invalid: true });
    });

    it('should return invalid error when value has 4 consecutive spaces', () => {
      control.setValue('valid text    content');
      const result = customTextValidator(control);
      expect(result).toEqual({ invalid: true });
    });

    it('should return invalid error when character count (without spaces) is less than 10', () => {
      control.setValue('short txt');
      const result = customTextValidator(control);
      expect(result).toEqual({ invalid: true });
    });

    it('should return invalid error when character count is exactly 9', () => {
      control.setValue('nine char');
      const result = customTextValidator(control);
      expect(result).toEqual({ invalid: true });
    });

    it('should return null for valid text with exactly 10 characters', () => {
      control.setValue('tencharact');
      const result = customTextValidator(control);
      expect(result).toBeNull();
    });

    it('should return null for valid text with more than 10 characters', () => {
      control.setValue('this is a valid text content');
      const result = customTextValidator(control);
      expect(result).toBeNull();
    });

    it('should return null for valid text with single spaces between words', () => {
      control.setValue('valid text content with single spaces');
      const result = customTextValidator(control);
      expect(result).toBeNull();
    });

    it('should return null for valid text with double spaces (allowed)', () => {
      control.setValue('valid text  content with double spaces');
      const result = customTextValidator(control);
      expect(result).toBeNull();
    });

    it('should properly handle HTML p tags removal', () => {
      control.setValue('<p>valid text content</p>');
      const result = customTextValidator(control);
      expect(result).toBeNull();
    });

    it('should handle HTML p tags with leading/trailing spaces after removal', () => {
      control.setValue('<p> invalid content </p>');
      const result = customTextValidator(control);
      expect(result).toEqual({ invalid: true });
    });

    it('should handle text with only opening p tag', () => {
      control.setValue('<p>valid text content');
      const result = customTextValidator(control);
      expect(result).toBeNull();
    });

    it('should handle text with only closing p tag', () => {
      control.setValue('valid text content</p>');
      const result = customTextValidator(control);
      expect(result).toBeNull();
    });

    it('should handle text with mixed content and p tags', () => {
      control.setValue('<p>this is valid content with enough characters</p>');
      const result = customTextValidator(control);
      expect(result).toBeNull();
    });
  });

  describe('locationOrOnlineLinkValidator', () => {
    let formGroup: FormGroup;

    beforeEach(() => {
      formGroup = new FormGroup({
        onlineLink: new FormControl(''),
        coordinates: new FormControl({ longitude: null })
      });
    });

    it('should return error when both onlineLink and longitude are missing', () => {
      formGroup.patchValue({
        onlineLink: '',
        coordinates: { longitude: null }
      });
      const result = locationOrOnlineLinkValidator(formGroup);
      expect(result).toEqual({ locationOrOnlineLinkRequired: true });
    });

    it('should return error when onlineLink is null and longitude is null', () => {
      formGroup.patchValue({
        onlineLink: null,
        coordinates: { longitude: null }
      });
      const result = locationOrOnlineLinkValidator(formGroup);
      expect(result).toEqual({ locationOrOnlineLinkRequired: true });
    });

    it('should return error when onlineLink is undefined and longitude is undefined', () => {
      formGroup.patchValue({
        onlineLink: undefined,
        coordinates: { longitude: undefined }
      });
      const result = locationOrOnlineLinkValidator(formGroup);
      expect(result).toEqual({ locationOrOnlineLinkRequired: true });
    });

    it('should return null when onlineLink is provided', () => {
      formGroup.patchValue({
        onlineLink: 'https://example.com',
        coordinates: { longitude: null }
      });
      const result = locationOrOnlineLinkValidator(formGroup);
      expect(result).toBeNull();
    });

    it('should return null when longitude is provided', () => {
      formGroup.patchValue({
        onlineLink: '',
        coordinates: { longitude: 50.4501 }
      });
      const result = locationOrOnlineLinkValidator(formGroup);
      expect(result).toBeNull();
    });

    it('should return null when both onlineLink and longitude are provided', () => {
      formGroup.patchValue({
        onlineLink: 'https://example.com',
        coordinates: { longitude: 50.4501 }
      });
      const result = locationOrOnlineLinkValidator(formGroup);
      expect(result).toBeNull();
    });

    it('should return error when longitude is 0 (falsy value)', () => {
      formGroup.patchValue({
        onlineLink: null,
        coordinates: { longitude: 0 }
      });
      const result = locationOrOnlineLinkValidator(formGroup);
      expect(result).toEqual({ locationOrOnlineLinkRequired: true });
    });

    it('should return null when longitude is negative', () => {
      formGroup.patchValue({
        onlineLink: '',
        coordinates: { longitude: -30.5234 }
      });
      const result = locationOrOnlineLinkValidator(formGroup);
      expect(result).toBeNull();
    });

    it('should handle missing coordinates object gracefully', () => {
      const formGroupWithoutCoordinates = new FormGroup({
        onlineLink: new FormControl(''),
        coordinates: new FormControl(null)
      });
      expect(() => {
        locationOrOnlineLinkValidator(formGroupWithoutCoordinates);
      }).toThrow();
    });

    it('should handle missing onlineLink control gracefully', () => {
      const formGroupWithoutOnlineLink = new FormGroup({
        coordinates: new FormControl({ longitude: 50.4501 })
      });
      const result = locationOrOnlineLinkValidator(formGroupWithoutOnlineLink);
      expect(result).toBeNull();
    });

    it('should handle missing coordinates control gracefully', () => {
      const formGroupWithoutCoordinates = new FormGroup({
        onlineLink: new FormControl('https://example.com')
      });
      const result = locationOrOnlineLinkValidator(formGroupWithoutCoordinates);
      expect(result).toBeNull();
    });
  });

  describe('dateFormatValidator', () => {
    let control: FormControl;
    let validator: any;

    beforeEach(() => {
      control = new FormControl();
      validator = dateFormatValidator();
    });

    it('should return error when control value is null', () => {
      control.setValue(null);
      const result = validator(control);
      expect(result).toEqual({ dateIncorrect: true });
    });

    it('should return error when control value is undefined', () => {
      control.setValue(undefined);
      const result = validator(control);
      expect(result).toEqual({ dateIncorrect: true });
    });

    it('should return error when control value is empty string', () => {
      control.setValue('');
      const result = validator(control);
      expect(result).toEqual({ dateIncorrect: true });
    });

    it('should return error when value has isValid method returning false', () => {
      const invalidDateObject = {
        isValid: () => false
      };
      control.setValue(invalidDateObject);
      const result = validator(control);
      expect(result).toEqual({ dateIncorrect: true });
    });

    it('should return null when value has isValid method returning true', () => {
      const validDateObject = {
        isValid: () => true
      };
      control.setValue(validDateObject);
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return null when value does not have isValid method', () => {
      const dateObject = {
        someProperty: 'value'
      };
      control.setValue(dateObject);
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should handle moment.js-like objects with valid dates', () => {
      const momentLikeObject = {
        isValid: jasmine.createSpy('isValid').and.returnValue(true),
        format: () => '2023-12-01'
      };
      control.setValue(momentLikeObject);
      const result = validator(control);
      expect(result).toBeNull();
      expect(momentLikeObject.isValid).toHaveBeenCalled();
    });

    it('should handle moment.js-like objects with invalid dates', () => {
      const momentLikeObject = {
        isValid: jasmine.createSpy('isValid').and.returnValue(false),
        format: () => 'Invalid date'
      };
      control.setValue(momentLikeObject);
      const result = validator(control);
      expect(result).toEqual({ dateIncorrect: true });
      expect(momentLikeObject.isValid).toHaveBeenCalled();
    });

    it('should handle objects with isValid property as function that throws error', () => {
      const problematicObject = {
        isValid: () => {
          throw new Error('Test error');
        }
      };
      control.setValue(problematicObject);
      expect(() => validator(control)).toThrow();
    });

    it('should handle string values (no isValid method)', () => {
      control.setValue('2023-12-01');
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should handle number values (no isValid method)', () => {
      control.setValue(1234567890);
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should handle boolean values (no isValid method)', () => {
      control.setValue(true);
      const result = validator(control);
      expect(result).toBeNull();
    });
  });
});
