// import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
// import { TranslateModule } from '@ngx-translate/core';
// import { of } from 'rxjs';

// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { UbsAdminSeveralOrdersPopUpComponent } from './ubs-admin-several-orders-pop-up.component';
// import { OrderService } from '../../services/order.service';

// describe('UbsAdminSeveralOrdersPopUpComponent', () => {
//   let fixture: ComponentFixture<UbsAdminSeveralOrdersPopUpComponent>;
//   let component: UbsAdminSeveralOrdersPopUpComponent;
//   let dialog: MatDialog;

//   let setEmployeesSpy: jasmine.Spy;
//   let initListenersSpy: jasmine.Spy;

//   const dataFromTable = [
//     {
//       arrayData: [
//         {
//           key: 'key',
//           ua: 'ua',
//           en: 'en',
//           filtered: true
//         }
//       ],
//       title: 'Dummy title'
//     }
//   ];

//   const initialFormValue = {
//     exportDetailsDto: {
//       dateExport: null,
//       timeDeliveryFrom: null,
//       timeDeliveryTo: null,
//       receivingStationId: null
//     },
//     responsiblePersonsForm: {
//       responsibleCaller: null,
//       responsibleLogicMan: null,
//       responsibleNavigator: null,
//       responsibleDriver: null
//     }
//   };

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [UbsAdminSeveralOrdersPopUpComponent],
//       imports: [HttpClientTestingModule, FormsModule, TranslateModule.forRoot(), ReactiveFormsModule],
//       providers: [
//         OrderService,
//         FormBuilder,
//         { provide: MatDialogRef, useValue: {} },
//         { provide: MAT_DIALOG_DATA, useValue: {} },
//         { provide: MatDialog, useValue: { open: () => of({ id: 1 }) } }
//       ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
//     }).compileComponents();

//     fixture = TestBed.createComponent(UbsAdminSeveralOrdersPopUpComponent);
//     component = fixture.componentInstance;

//     initListenersSpy = spyOn(component, 'initializeListeners');
//     setEmployeesSpy = spyOn(component, 'setEmployeesByPosition').and.callFake(() => {});

//     component.dataFromTable = dataFromTable;
//     component.ordersId = [1, 2, 3];
//     component.currentLang = 'en';

//     fixture.detectChanges();
//     dialog = TestBed.inject(MatDialog);
//   }));

//   it('should be created', () => {
//     expect(component).toBeTruthy();
//     expect(initListenersSpy).toHaveBeenCalled();
//     expect(setEmployeesSpy).toHaveBeenCalled();
//     expect(component.toSelect).toEqual(undefined);
//     expect(component.fromInput).toEqual(undefined);
//     expect(component.toInput).toEqual(undefined);
//     expect(component.from).toEqual(undefined);
//     expect(component.to).toEqual(undefined);
//     expect(component.allCallManagers).toEqual(undefined);
//     expect(component.allDrivers).toEqual(undefined);
//   });

//   it('should set correct current date', () => {
//     const currentDate = new Date().toISOString().split('T')[0];
//     expect(component.currentDate).toEqual(currentDate);
//   });

//   it('should create a form', () => {
//     expect(component.ordersForm.value).toEqual(initialFormValue);
//   });

//   it('isSelectedTimeValid()', () => {
//     const currHour = new Date().getHours();
//     const currMinute = new Date().getMinutes();
//     const selectedTime = '23:00';
//     const selectedHour = Number(selectedTime.split(':')[0]);
//     const selectedMinute = Number(selectedTime.split(':')[1]);

//     if (currHour < selectedHour || (currHour === selectedHour && currMinute < selectedMinute)) {
//       expect(component.isSelectedTimeValid(selectedTime)).toBe(true);
//     } else {
//       expect(component.isSelectedTimeValid(selectedTime)).toBe(false);
//     }
//   });

//   it('should show timepicker when timeFrom input has been clicked', () => {
//     const inputTimeFrom = fixture.debugElement.nativeElement.querySelector('#export-time-from');
//     inputTimeFrom.click();
//     expect(component.showTimePicker).toEqual(true);
//   });

//   it('should show timepicker when timeTo input has been clicked', () => {
//     const inputTimeFrom = fixture.debugElement.nativeElement.querySelector('#export-time-to');
//     inputTimeFrom.click();
//     expect(component.showTimePicker).toEqual(true);
//   });

//   it('should set the next day as min value for date input if current working day is over', () => {
//     const date = new Date();
//     date.setDate(date.getDate() + 1);
//     const minDateValue = date.toISOString().split('T')[0];
//     spyOn(component, 'isSelectedTimeValid').and.returnValue(false);
//     component.setClosestAvailableDate();
//     expect(component.closestAvailableDate).toEqual(minDateValue);
//   });
// });
