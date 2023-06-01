import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { FilterSelect } from 'src/app/main/interface/filter-select.interface';

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
  @Output() filtersList = new EventEmitter<any>();

  constructor(private langService: LanguageService) {}

  ngOnInit(): void {
    console.log(this.filter);
  }

  toggleAllSelection(filterName: string): void {
    this.selectAll.emit(filterName);
  }

  updateSelectedFilters(value: any, event): void {
    console.log(value);
    console.log(event);
  }

  getLangValue(uaValue: string, enValue: string): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }
}
