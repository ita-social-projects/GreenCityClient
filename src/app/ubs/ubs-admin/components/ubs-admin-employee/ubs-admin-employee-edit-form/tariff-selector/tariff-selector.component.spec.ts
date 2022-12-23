import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { TariffsService } from 'src/app/ubs/ubs-admin/services/tariffs.service';

import { TariffSelectorComponent } from './tariff-selector.component';
import { MatButtonModule } from '@angular/material/button';

describe('TariffSelectorComponent', () => {
  let component: TariffSelectorComponent;
  let fixture: ComponentFixture<TariffSelectorComponent>;
  let loader: HarnessLoader;

  const dialogRefMock = { close: () => {} };
  const tariffsServiceMock = {
    getLocations: () =>
      of([
        {
          regionId: 1,
          regionTranslationDtos: [
            {
              regionName: 'Київська область',
              languageCode: 'ua'
            },
            {
              regionName: 'Kyiv region',
              languageCode: 'en'
            }
          ],
          locationsDto: [
            {
              locationId: 1,
              locationStatus: 'ACTIVE',
              latitude: 50.4782,
              longitude: 33.5897,
              locationTranslationDtoList: [
                {
                  locationName: 'Київ',
                  languageCode: 'ua'
                },
                {
                  locationName: 'Kyiv',
                  languageCode: 'en'
                }
              ]
            },
            {
              locationId: 25,
              locationStatus: 'ACTIVE',
              latitude: 50.4782,
              longitude: 33.5897,
              locationTranslationDtoList: [
                {
                  locationName: '20км',
                  languageCode: 'ua'
                },
                {
                  locationName: '20km',
                  languageCode: 'en'
                }
              ]
            }
          ]
        },
        {
          regionId: 10,
          regionTranslationDtos: [
            {
              regionName: 'Львівська область',
              languageCode: 'ua'
            },
            {
              regionName: 'Lviv region',
              languageCode: 'en'
            }
          ],
          locationsDto: [
            {
              locationId: 23,
              locationStatus: 'ACTIVE',
              latitude: 49.839683,
              longitude: 24.029717,
              locationTranslationDtoList: [
                {
                  locationName: 'Львів',
                  languageCode: 'ua'
                },
                {
                  locationName: 'Lviv',
                  languageCode: 'en'
                }
              ]
            }
          ]
        }
      ]),
    getCouriers: () =>
      of([
        {
          courierId: 1,
          courierStatus: 'ACTIVE',
          courierTranslationDtos: [
            {
              name: 'УБС',
              nameEng: 'UBS'
            }
          ],
          createDate: '2022-12-23',
          createdBy: ' '
        }
      ]),
    getAllStations: () =>
      of([
        {
          id: 1,
          name: 'Саперно-Слобідська',
          createdBy: ' null',
          createDate: '2022-12-21'
        }
      ]),
    getFilteredCard: (filters: { region?: number[]; location?: number[]; courier?: number[]; station?: number[] } = {}) => {
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
          courierTranslationDtos: [
            {
              name: 'УБС',
              nameEng: 'UBS'
            }
          ],
          tariffStatus: 'ACTIVE',
          creator: 'nik.korzh.ita@gmail.com',
          createdAt: '2022-12-21',
          courierLimit: 'LIMIT_BY_AMOUNT_OF_BAG',
          minAmountOfBags: 2,
          maxAmountOfBags: 999,
          minPriceOfOrder: null,
          maxPriceOfOrder: null,
          courierId: 1
        }
      ];
      let filtered = tariffs;
      filtered = filters.region?.length ? tariffs.filter((tariff) => filters.region.includes(tariff.regionDto.regionId)) : filtered;
      filtered = filters.location?.length
        ? tariffs.filter((tariff) => filters.location.includes(tariff.locationInfoDtos[0].locationId))
        : filtered;
      filtered = filters.courier?.length ? tariffs.filter((tariff) => filters.courier.includes(tariff.courierId)) : filtered;
      filtered = filters.station?.length
        ? tariffs.filter((tariff) => filters.station.includes(tariff.receivingStationDtos[0].id))
        : filtered;
      return of(filtered);
    }
  };

  const getOptionsText = async (selectHarness: MatSelectHarness) => {
    await selectHarness.open();
    const options = await selectHarness.getOptions();
    return await Promise.all(options.map((option) => option.getText()));
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TariffSelectorComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatSelectModule,
        MatCheckboxModule,
        MatButtonModule,
        MatDialogModule,
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
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

  it('should load filters and theirs options correctly', async () => {
    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();

    const regionsFilterSelect = await loader.getHarness(MatSelectHarness.with({ selector: '.filter-regions' }));
    const citiesFilterSelect = await loader.getHarness(MatSelectHarness.with({ selector: '.filter-cities' }));
    const couriersFilterSelect = await loader.getHarness(MatSelectHarness.with({ selector: '.filter-couriers' }));
    const stationsFilterSelect = await loader.getHarness(MatSelectHarness.with({ selector: '.filter-stations' }));

    expect(await getOptionsText(regionsFilterSelect)).toEqual(['Kyiv region', 'Lviv region']);
    expect(await citiesFilterSelect.isDisabled()).toBeTruthy();
    expect(await getOptionsText(couriersFilterSelect)).toEqual(['UBS']);
    expect(await getOptionsText(stationsFilterSelect)).toEqual(['Саперно-Слобідська']);
  });

  it('filters should be applied correctly', async () => {
    component.ngOnInit();
    fixture.detectChanges();

    const regionsFilterSelect = await loader.getHarness(MatSelectHarness.with({ selector: '.filter-regions' }));
    await regionsFilterSelect.open();
    await regionsFilterSelect.clickOptions({ text: 'Kyiv region' });
    await regionsFilterSelect.close();

    expect(fixture.debugElement.queryAll(By.css('.table-tariffs tbody tr')).length).toBe(1);

    const locationsFilterSelect = await loader.getHarness(MatSelectHarness.with({ selector: '.filter-cities' }));
    await locationsFilterSelect.open();
    await locationsFilterSelect.clickOptions({ text: '20km' });
    await locationsFilterSelect.close();

    expect(fixture.debugElement.queryAll(By.css('.table-tariffs tbody tr')).length).toBe(0);
  });

  it('locations select should be disabled if no region is selected', async () => {
    component.ngOnInit();
    fixture.detectChanges();

    const regionsFilterSelect = await loader.getHarness(MatSelectHarness.with({ selector: '.filter-regions' }));
    await regionsFilterSelect.open();
    await regionsFilterSelect.clickOptions({ text: 'Kyiv region' });
    await regionsFilterSelect.close();

    await regionsFilterSelect.open();
    await regionsFilterSelect.clickOptions({ text: 'Kyiv region' });
    await regionsFilterSelect.close();

    const locationsFilterSelect = await loader.getHarness(MatSelectHarness.with({ selector: '.filter-cities' }));
    expect(await locationsFilterSelect.isDisabled()).toBeTruthy();
  });

  it('selecting tariff and clicking `select` button should close popup with list of tariff ids', async () => {
    component.ngOnInit();
    fixture.detectChanges();

    const regionsFilterSelect = await loader.getHarness(MatSelectHarness.with({ selector: '.filter-regions' }));
    await regionsFilterSelect.open();
    await regionsFilterSelect.clickOptions({ text: 'Kyiv region' });
    await regionsFilterSelect.close();

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
        location: { en: 'Kyiv', ua: 'Київ' },
        station: 'Саперно-Слобідська'
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
