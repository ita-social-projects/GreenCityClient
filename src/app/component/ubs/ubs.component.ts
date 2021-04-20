import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-ubs',
  templateUrl: './ubs.component.html'
})
export class UbsComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.localStorageService.languageBehaviourSubject.subscribe(lang => {
      this.translate.setDefaultLang(lang);
    });
  }

}
