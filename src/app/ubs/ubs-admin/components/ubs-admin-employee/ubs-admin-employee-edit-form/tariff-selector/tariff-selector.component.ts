import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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
  filteredTariffs = [];

  search: FormControl;
  tariffsForm: FormGroup;

  private mappers = {
    tariffs: (tariffData) =>
      tariffData.map((tariff) => ({
        id: tariff.cardId,
        courier: { en: tariff.courierDto.nameEn, ua: tariff.courierDto.nameUk },
        region: { en: tariff.regionDto.nameEn, ua: tariff.regionDto.nameUk },
        locations: tariff.locationInfoDtos.map((loc) => ({ en: loc.nameEn, ua: loc.nameUk })),
        selected: false
      }))
  };

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TariffSelectorComponent>,
    private tariffsService: TariffsService
  ) {
    this.search = this.fb.control(null);

    this.search.valueChanges.subscribe((term) => {
      this.filteredTariffs = this.tariffs.filter((tariff) => {
        const match = (str, substr) => str.toLowerCase().includes(substr.trim().toLowerCase());
        const regionMatch = match(tariff.region.en, term) || match(tariff.region.ua, term);
        const locationsMatch = tariff.locations.some((location) => match(location.en, term) || match(location.ua, term));
        const courierMatch = match(tariff.courier.en, term) || match(tariff.courier.ua, term);
        return [regionMatch, locationsMatch, courierMatch].some((cond) => cond);
      });
    });
  }

  ngOnInit(): void {
    this.tariffsService.getFilteredCard({ status: 'ACTIVE' }).subscribe((data) => {
      const tariffs = this.mappers.tariffs(data);
      this.tariffs = tariffs;
      this.filteredTariffs = tariffs;
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    const selectedTariffs = this.tariffs.filter((tariff) => tariff.selected).map(({ selected, ...tariffData }) => tariffData);
    this.dialogRef.close(selectedTariffs);
  }
}
