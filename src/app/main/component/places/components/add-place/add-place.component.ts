import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.scss']
})
export class AddPlaceComponent implements OnInit {
  public addPlaceForm: FormGroup;

  @Output() private getAddressData: any = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {}

  initForm(): void {
    this.addPlaceForm = this.fb.group({
      type: ['', Validators.required],
      name: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/[0-9a-zа-я]/i)]],
      address: ['', [Validators.required, Validators.maxLength(60), Validators.pattern(/[0-9a-zа-я]/i)]],
      workingHours: ['', [Validators.required]]
    });
  }

  get type() {
    return this.addPlaceForm.get('type') as FormControl;
  }

  get name() {
    return this.addPlaceForm.get('name') as FormControl;
  }

  get address() {
    return this.addPlaceForm.get('address') as FormControl;
  }

  get workingHours() {
    return this.addPlaceForm.get('workingHours') as FormControl;
  }

  onLocationSelected(event: any) {
    this.getAddressData.emit(event);
  }

  cancel(): void {
    this.initForm();
  }

  clear(property: string): void {
    this.addPlaceForm.get(property).setValue('');
  }

  addPlace(): void {
    // код для обробки форми і додавання маркера
    this.initForm();
  }
}
