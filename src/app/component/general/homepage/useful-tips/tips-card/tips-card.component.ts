import { Component, OnInit, Input } from '@angular/core';
import { LanguageService } from '../../../../../i18n/language.service';

@Component({
  selector: 'app-tips-card',
  templateUrl: './tips-card.component.html',
  styleUrls: ['./tips-card.component.css']
})
export class TipsCardComponent implements OnInit {
  language: string = this.languageService.getCurrentLanguage();
  @Input() tip: { imageUrl, textUk, textRu, textEn };

  constructor(private languageService: LanguageService) { }

  ngOnInit() {
  }

}
