import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { LanguageService } from 'src/app/shared/i18n/language.service';
import { ActiveTariffInfo, Bag } from '../../../models/ubs.interface';

@Component({
  selector: 'app-ubs-main-page-price-section',
  templateUrl: './ubs-price-section.component.html',
  styleUrls: ['./ubs-price-section.component.scss']
})
export class UbsMainPagePriceSectionComponent {
  @Input() tariffToShow: ActiveTariffInfo | null = null;
  @Input() tariffs: ActiveTariffInfo[] = [];
  @Input() isTarriffLoading = true;
  @Input() bags: Bag[] = [];

  @Output() tariffSelected = new EventEmitter<number>();

  readonly perPackageTitle = 'ubs-homepage.ubs-courier.price.price-title';

  constructor(public languageService: LanguageService) {}

  onTariffSelected(locationId: number): void {
    this.tariffSelected.emit(locationId);
  }

  openAuto(event: Event, trigger: MatAutocompleteTrigger): void {
    event.stopPropagation();
    trigger.openPanel();
  }

  getElementDescription(nameUk: string, nameEn: string, capacity: number): string {
    const normalizedNameUk = (nameUk ?? '').toLowerCase();
    const normalizedNameEn = (nameEn ?? '').toLowerCase();

    const ukrName = normalizedNameUk ? normalizedNameUk.charAt(0).toUpperCase() + normalizedNameUk.slice(1) : '';
    const engName = normalizedNameEn ? normalizedNameEn.charAt(0).toUpperCase() + normalizedNameEn.slice(1) : '';
    const ukrDescription = `${ukrName} об'ємом ${capacity} л`;
    const engDescription = `${engName} with a volume of ${capacity} l`;

    return this.languageService.getLangValue(ukrDescription, engDescription);
  }
}
