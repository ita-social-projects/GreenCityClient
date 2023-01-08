import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { TariffsService } from 'src/app/ubs/ubs-admin/services/tariffs.service';

@Component({
  selector: 'app-tariff-selector',
  templateUrl: './tariff-selector.component.html',
  styleUrls: ['./tariff-selector.component.scss']
})
export class TariffSelectorComponent implements OnInit {
  icons = {
    arrowDown: '././assets/img/ubs-tariff/arrow-down.svg',
    cross: '././assets/img/ubs/cross.svg'
  };

  tariffs = [];

  regions = [];
  cities = [];
  couriers = [];
  stations = [];

  filteredCities = [];

  filtersForm: FormGroup;
  tariffsForm: FormGroup;

  private mappers = {
    tariffs: (tariffData) =>
      tariffData.map((tariff) => ({
        id: tariff.cardId,
        courier: { en: tariff.courierDto.nameEn, ua: tariff.courierDto.nameUk },
        region: { en: tariff.regionDto.nameEn, ua: tariff.regionDto.nameUk },
        location: { en: tariff.locationInfoDtos[0].nameEn, ua: tariff.locationInfoDtos[0].nameUk },
        station: tariff.receivingStationDtos[0].name
      })),
    regions: (regionsData) =>
      regionsData.map((region) => ({
        id: region.regionId,
        name: Object.fromEntries(region.regionTranslationDtos.map(({ regionName, languageCode }) => [languageCode, regionName])),
        locations: region.locationsDto
          .filter((location) => location.locationStatus === 'ACTIVE')
          .map((location) => ({
            id: location.locationId,
            name: Object.fromEntries(
              location.locationTranslationDtoList.map(({ locationName, languageCode }) => [languageCode, locationName])
            ),
            regionId: region.regionId
          }))
      })),
    couriers: (couriersData) =>
      couriersData.map((courier) => ({
        id: courier.courierId,
        name: {
          en: courier.nameEn,
          ua: courier.nameUk
        }
      })),
    stations: (stationsData) => stationsData.map(({ id, name }) => ({ id, name }))
  };

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<TariffSelectorComponent>, private tariffsService: TariffsService) {
    this.filtersForm = this.fb.group({
      regions: [[]],
      cities: [{ value: [], disabled: true }],
      couriers: [[]],
      stations: [[]]
    });

    this.tariffsForm = this.fb.group({});

    this.filtersForm.valueChanges.subscribe((value) => {
      this.tariffsForm = this.fb.group({});

      const regions = this.regions.filter((region) => value.regions.includes(region.id));
      this.filteredCities = regions.map((region) => region.locations).flat();

      this.tariffsService
        .getFilteredCard({
          ...(value?.regions && { region: value.regions }),
          ...(value?.cities && { location: value.cities }),
          ...(value?.couriers && { courier: value.couriers }),
          ...(value?.stations && { receivingStation: value.stations }),
          status: 'ACTIVE'
        })
        .subscribe((data) => {
          this.tariffs = this.mappers.tariffs(data);
          this.tariffsForm = this.fb.group({
            ...Object.fromEntries(this.tariffs.map(({ id }) => [id, false]))
          });
        });
    });
  }

  ngOnInit(): void {
    forkJoin([this.tariffsService.getLocations(), this.tariffsService.getCouriers(), this.tariffsService.getAllStations()]).subscribe(
      ([regionsData, couriersData, stationsData]) => {
        this.regions = this.mappers.regions(regionsData);
        this.couriers = this.mappers.couriers(couriersData);
        this.stations = this.mappers.stations(stationsData);
      }
    );
  }

  onRegionSelectionChange() {
    if (this.filtersForm.value.regions?.length) {
      this.filtersForm.get('cities').enable();
      return;
    }
    this.filtersForm.get('cities').disable();
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    const tariffsToAdd = Object.entries(this.tariffsForm.value)
      .filter(([id, checked]) => checked)
      .map(([id]) => Number(id))
      .map((id) => ({ ...this.tariffs.find((tariff) => tariff.id === id) }));
    this.dialogRef.close(tariffsToAdd);
  }
}
