import { Component, OnInit } from '@angular/core';
import { ubsHeaderIcons } from '../../ubs-admin/components/ubs-image-pathes/ubs-header-icons';
import { languages } from 'src/app/shared/languages/languages';
import { LanguageModel } from '../../ubs-admin/models/languageModel';
import { Language } from '../../main/i18n/Language';
import { LanguageService } from '../../main/i18n/language.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ubs-header',
  templateUrl: './ubs-header.component.html',
  styleUrls: ['./ubs-header.component.scss']
})
export class UbsHeaderComponent implements OnInit {
  public toggleBurgerMenu = false;
  langDropdownVisible = false;
  arrayLang: Array<LanguageModel> = languages;
  ubsHeaderIcons = ubsHeaderIcons;
  constructor(private languageService: LanguageService, private router: Router) {}

  ngOnInit() {
    this.setLangArr();
  }

  setLangArr(): void {
    const language = this.languageService.getCurrentLanguage();
    const currentLangObj = { lang: language.charAt(0).toUpperCase() + language.slice(1), langName: language };
    const currentLangIndex = this.arrayLang.findIndex((lang) => lang.lang === currentLangObj.lang);
    this.arrayLang = [currentLangObj, ...this.arrayLang.slice(0, currentLangIndex), ...this.arrayLang.slice(currentLangIndex + 1)];
  }

  autoCloseLangDropDown(event): void {
    this.langDropdownVisible = event;
  }

  changeCurrentLanguage(language, index: number): void {
    this.languageService.changeCurrentLanguage(language.toLowerCase() as Language);
    const temporary = this.arrayLang[0].lang;
    this.arrayLang[0].lang = language;
    this.arrayLang[index].lang = temporary;
    this.langDropdownVisible = false;
  }

  public onToggleBurgerMenu(): void {
    this.toggleBurgerMenu = !this.toggleBurgerMenu;
    this.toggleScroll();
  }

  public toggleScroll(): void {
    this.toggleBurgerMenu ? document.body.classList.add('modal-open') : document.body.classList.remove('modal-open');
  }
}
