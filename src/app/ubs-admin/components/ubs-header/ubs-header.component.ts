import { Component, OnInit } from '@angular/core';
import { languages } from 'src/app/shared/languages/languages';
import { LanguageModel } from '../../models/languageModel';
import { Language } from '../../../main/i18n/Language';
import { LanguageService } from '../../../main/i18n/language.service';

@Component({
  selector: 'app-ubs-header',
  templateUrl: './ubs-header.component.html',
  styleUrls: ['./ubs-header.component.scss']
})
export class UbsHeaderComponent implements OnInit {
  public langDropdownVisible = false;
  arrayLang: Array<LanguageModel> = languages;

  constructor(private languageService: LanguageService) {}

  ngOnInit() {
    this.setLangArr();
  }

  setLangArr(): void {
    const language = this.languageService.getCurrentLanguage();
    const currentLangObj = { lang: language.charAt(0).toUpperCase() + language.slice(1), langName: language };
    const currentLangIndex = this.arrayLang.findIndex((lang) => lang.lang === currentLangObj.lang);
    this.arrayLang = [currentLangObj, ...this.arrayLang.slice(0, currentLangIndex), ...this.arrayLang.slice(currentLangIndex + 1)];
  }

  public autoCloseLangDropDown(event): void {
    this.langDropdownVisible = event;
  }

  public changeCurrentLanguage(language, index: number): void {
    this.languageService.changeCurrentLanguage(language.toLowerCase() as Language);
    const temporary = this.arrayLang[0].lang;
    this.arrayLang[0].lang = language;
    this.arrayLang[index].lang = temporary;
    this.langDropdownVisible = false;
  }
}
