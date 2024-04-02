import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { TariffsService } from 'src/app/ubs/ubs-admin/services/tariffs.service';
import { limitStatus } from '../../../ubs-admin-tariffs/ubs-tariffs.enum';
import { TariffSelectorComponent } from './tariff-selector.component';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

describe('TariffSelectorComponent', () => {
  let component: TariffSelectorComponent;
  let fixture: ComponentFixture<TariffSelectorComponent>;
  let loader: HarnessLoader;

  const dialogRefMock = { close: () => {} };
  const tariffsServiceMock = {
    getFilteredCard: () => {
      const tariffs = [
        {
          cardId: 1,
          regionDto: {
            regionId: 1,
            nameEn: 'Kyiv region',
            nameUk: 'Київська область'
          },
          locationInfoDtos: [
            {
              locationId: 1,
              nameEn: 'Kyiv',
              nameUk: 'Київ'
            }
          ],
          receivingStationDtos: [
            {
              id: 1,
              name: 'Саперно-Слобідська',
              createdBy: 'nik.korzh.ita@gmail.com',
              createDate: '2022-12-21'
            }
          ],
          courierDto: {
            nameUk: 'УБС',
            nameEn: 'UBS'
          },
          tariffStatus: 'ACTIVE',
          creator: 'nik.korzh.ita@gmail.com',
          createdAt: '2022-12-21',
          courierLimit: limitStatus.limitByAmountOfBag,
          minAmountOfBags: 2,
          maxAmountOfBags: 999,
          minPriceOfOrder: null,
          maxPriceOfOrder: null,
          courierId: 1
        }
      ];
      return of(tariffs);
    }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TariffSelectorComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        MatSelectModule,
        MatCheckboxModule,
        MatButtonModule,
        MatDialogModule,
        NoopAnimationsModule
      ],
      providers: [
        UntypedFormBuilder,
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: TariffsService, useValue: tariffsServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TariffSelectorComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('selecting tariff and clicking `select` button should close popup with list of tariff ids', async () => {
    component.ngOnInit();
    fixture.detectChanges();

    const tariffCheckbox = await loader.getHarness(MatCheckboxHarness.with({ selector: '.tariff-checkbox' }));
    await tariffCheckbox.check();

    const dialogRefSpy = spyOn(dialogRefMock, 'close');

    const selectButton = fixture.debugElement.query(By.css('.submit-button'));
    selectButton.triggerEventHandler('click', {});

    expect(dialogRefSpy).toHaveBeenCalledWith([
      {
        id: 1,
        courier: { en: 'UBS', ua: 'УБС' },
        region: { en: 'Kyiv region', ua: 'Київська область' },
        locations: [{ en: 'Kyiv', ua: 'Київ' }]
      }
    ]);
  });

  it('clicking `cancel` button should close popup with `undefined`', async () => {
    component.ngOnInit();
    fixture.detectChanges();

    const dialogRefSpy = spyOn(dialogRefMock, 'close');

    const cancelButton = fixture.debugElement.query(By.css('.cancel-button'));
    cancelButton.triggerEventHandler('click', {});

    expect(dialogRefSpy).toHaveBeenCalledWith();
  });
});
