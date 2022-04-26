import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormGroup, FormControl } from '@angular/forms';

import { UbsAdminExportDetailsComponent } from './ubs-admin-export-details.component';

describe('UbsAdminExportDetailsComponent', () => {
  let component: UbsAdminExportDetailsComponent;
  let fixture: ComponentFixture<UbsAdminExportDetailsComponent>;
  const mockDate = '2022-01-01';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminExportDetailsComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(mockDate));

    fixture = TestBed.createComponent(UbsAdminExportDetailsComponent);
    component = fixture.componentInstance;
    component.exportDetailsDto = new FormGroup({
      dateExport: new FormControl(''),
      timeDeliveryFrom: new FormControl(''),
      timeDeliveryTo: new FormControl(''),
      receivingStationId: new FormControl('')
    });
    (component.exportInfo = {
      allReceivingStations: [
        {
          createDate: '2022-04-14',
          createdBy: 'null',
          id: 1,
          name: 'Саперно-Слобідська'
        }
      ],
      dateExport: null,
      timeDeliveryFrom: null,
      timeDeliveryTo: null,
      receivingStationId: 1
    }),
      fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should set current date to min attribute ', () => {
    component.pageOpen = true;
    fixture.detectChanges();
    const inputElem = fixture.debugElement.nativeElement.querySelector('#export-date');

    expect(inputElem.min).toBe(mockDate);
  });
});
