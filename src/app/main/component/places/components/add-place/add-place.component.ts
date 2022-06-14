import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.scss']
})
export class AddPlaceComponent implements OnInit {
  public addPlaceForm: FormGroup;
  public workingHours = '';
  public address = '';
  public type = '';
  public name = '';
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
