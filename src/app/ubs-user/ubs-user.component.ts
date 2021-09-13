import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ubs-user',
  templateUrl: './ubs-user.component.html',
  styleUrls: ['./ubs-user.component.scss']
})
export class UbsUserComponent implements OnInit, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  constructor(private translate: TranslateService, private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((lang) => {
      this.translate.setDefaultLang(lang !== 'en' && lang !== 'ua' ? 'ua' : lang);
    });
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
