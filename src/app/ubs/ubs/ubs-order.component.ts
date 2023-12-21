import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

import { TranslateService } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-ubs',
  templateUrl: './ubs-order.component.html',
  styleUrls: ['./ubs-order.component.scss']
})
export class UbsOrderComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(private translate: TranslateService, private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroyed$)).subscribe((lang) => {
      this.translate.setDefaultLang(lang);
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
