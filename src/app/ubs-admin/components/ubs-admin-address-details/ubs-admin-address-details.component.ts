import { Component, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ubs-admin-address-details',
  templateUrl: './ubs-admin-address-details.component.html',
  styleUrls: ['./ubs-admin-address-details.component.scss']
})
export class UbsAdminAddressDetailsComponent implements OnDestroy {
  @Input() order;
  @Input() addressDetailsForm: FormGroup;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  districts = [
    'Голосіївський',
    'Дарницький',
    'Деснянський',
    'Дніпровський',
    'Оболонський',
    'Печерський',
    'Подільський',
    'Святошинський',
    'Солом`янський',
    'Шевченківський'
  ];

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
