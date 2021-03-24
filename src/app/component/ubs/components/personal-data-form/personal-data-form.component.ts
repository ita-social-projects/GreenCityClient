import { MatDialog } from '@angular/material';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonalData } from '../../models/personalData.model';
import { ShareFormService } from '../../services/share-form.service';
import { OrderService } from '../../services/order.service';
import { AddAddressComponent } from './add-address/add-address/add-address.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-personal-data-form',
  templateUrl: './personal-data-form.component.html',
  styleUrls: ['./personal-data-form.component.scss']
})
export class PersonalDataFormComponent implements OnInit, OnDestroy {
  personalDataForm: FormGroup;
  personalData: PersonalData;
  region = '';
  longitude: number;
  latitude: number;
  namePattern = /^[A-Za-zА-Яа-яїієё\.\'\-\\]+$/;
  phoneMask = '+{38} (000) 000 00 00';
  nextDisabled = true;
  districtDisabled = true;
  order: any;
  addresses: any = [];
  private destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private orderService: OrderService,
    private shareFormService: ShareFormService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddAddressComponent, {
      data: {}
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe(address => {
        if (address !== undefined) {
          this.addresses.push(address);
        }
      });
  }

  ngOnInit(): void {
    this.shareFormService.objectSource.subscribe(order => {
      this.order = order
    });
    this.personalDataForm = this.fb.group({
      firstName: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern(this.namePattern)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern(this.namePattern)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      phoneNumber: ['+38 0', [
        Validators.required,
        Validators.minLength(12)
      ]],
      addressComment: ['', Validators.maxLength(170)]
    });

    this.orderService.getPersonalData()
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe((data: PersonalData[]) => {
        this.personalData = data[data.length - 1];
        this.initForm();
      });
  }

  ngOnDestroy(): void {
    this.shareFormService.objectSource.unsubscribe();
  }

  initForm(): void {
    this.personalDataForm.setValue({
      firstName: this.personalData.firstName,
      lastName: this.personalData.lastName,
      email: this.personalData.email,
      phoneNumber: '380' + this.personalData.phoneNumber,
      addressComment: this.personalData.addressComment,
    });
  }

  submit(): void {
    const personalData: PersonalData = {
      firstName: this.personalDataForm.get('firstName').value,
      lastName: this.personalDataForm.get('lastName').value,
      email: this.personalDataForm.get('email').value,
      phoneNumber: this.personalDataForm.get('phoneNumber').value.slice(3),
      city: this.addresses[0].city,
      district: this.addresses[0].district,
      street: this.addresses[0].street.split(',').splice(0, 1).join().split(' ').splice(1, 1).join(),
      houseNumber: this.addresses[0].street.split(',').slice(1).join().trim(),
      houseCorpus: this.addresses[0].houseCorpus,
      entranceNumber: this.addresses[0].entranceNumber,
      addressComment: this.personalDataForm.get('addressComment').value,
      id: 1,
      latitude: this.addresses[0].latitude,
      longitude: this.addresses[0].longitude
    };
    this.order.personalData = personalData;
    this.orderService.processOrder(this.order)
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe();
    this.shareFormService.thirdStepObject(this.order);
  }
}
