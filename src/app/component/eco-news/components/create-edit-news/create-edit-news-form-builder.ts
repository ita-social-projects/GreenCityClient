import { Injectable } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';


@Injectable({
    providedIn: 'root'
})

export class CreateEditNewsFormBuilder {

    public form: FormGroup;

    constructor(private fb: FormBuilder) { }

    getSetupForm() {
        this.form = this.fb.group({
            title: ['', [Validators.required, Validators.maxLength(170), this.noWhitespaceValidator]],
            source: [''],
            content: ['', [Validators.required, Validators.minLength(20)]],
            tags: this.fb.array([]),
            image: ['']
        });

        return this.form;
    }

    getEditForm(data) {
        this.form = this.fb.group({
            title: [data.title, [Validators.required, Validators.maxLength(170), this.noWhitespaceValidator]],
            source: [data.source],
            content: [data.text, [Validators.required, Validators.minLength(20)]],
            tags: this.fb.array(data.tags),
            image: [data.imagePath]
        });

        return this.form;
    }

    public noWhitespaceValidator(control: FormControl) {
        const isWhiteSpace = (control.value || '').trim().length === 0;
        const isValid = !isWhiteSpace;
        return isValid ? null : { whitespace: true };
    }
}
