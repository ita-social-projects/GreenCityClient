import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { FilterOptions, FilterSelect } from 'src/app/main/interface/filter-select.interface';

@Component({
  selector: 'app-filter-select',
  templateUrl: './filter-select.component.html',
  styleUrls: ['./filter-select.component.scss']
})
export class FilterSelectComponent implements OnInit {
  @Input() filter: FilterSelect;
  @ViewChild('statusFilter') statusesList: MatSelect;

  statusFilterControl = new FormControl();

  @Output() selectAll = new EventEmitter<any>();
  @Output() selectedList = new EventEmitter<any>();

  constructor(private langService: LanguageService) {}

  ngOnInit(): void {
    console.log(this.filter);
  }

  toggleAllSelection(filterName: string): void {
    this.filter.options.forEach((el) => (el.isActive = true));
    this.selectAll.emit(filterName);
  }

  updateSelectedFilters(option: FilterOptions, event: MatOptionSelectionChange): void {
    option.isActive = event.source.selected;
    this.selectedList.emit(this.filter);
  }

  getLangValue(uaValue: string, enValue: string): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }
}
