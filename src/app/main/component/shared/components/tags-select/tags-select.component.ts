import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { TagInterface } from '../tag-filter/tag-filter.model';

@Component({
  selector: 'app-tags-select',
  templateUrl: './tags-select.component.html',
  styleUrls: ['./tags-select.component.scss']
})
export class TagsSelectComponent {
  @Input() tagsList: TagInterface[];
  @Input() tagMaxLength = 0;
  selectedList: TagInterface[];
  @Output() selectTags = new EventEmitter<TagInterface[]>();

  constructor(private langService: LanguageService) {}

  checkTab(tag: TagInterface): void {
    const isMaxLength = this.selectedList && this.tagMaxLength ? this.selectedList.length >= this.tagMaxLength : false;
    tag.isActive = isMaxLength && !tag.isActive ? tag.isActive : !tag.isActive;
    this.selectedList = this.tagsList.filter((item) => item.isActive);
    this.selectTags.emit(this.selectedList);
  }

  getLangValue(valUa: string, valEn: string): string {
    return this.langService.getLangValue(valUa, valEn) as string;
  }
}
