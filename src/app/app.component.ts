import {Component, OnInit} from '@angular/core';
import {LanguageService} from './i18n/language.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'GreenCityClient';

  constructor(private languageService: LanguageService) { }


  ngOnInit(): void {
    this.languageService.setDefaultLanguage();
  }
}
