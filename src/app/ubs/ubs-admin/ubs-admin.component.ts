import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IAppState } from 'src/app/store/state/app.state';
import { Store } from '@ngrx/store';
import { GetEmployeesPermissions } from 'src/app/store/actions/employee.actions';
import { JwtService } from '@global-service/jwt/jwt.service';

@Component({
  selector: 'app-ubs-admin',
  templateUrl: './ubs-admin.component.html',
  styleUrls: ['./ubs-admin.component.scss']
})
export class UbsAdminComponent implements OnInit, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  hasAuthorities: boolean;
  authorities: string[] = [];
  permissions$ = this.store.select((state: IAppState): Array<string> => state.employees.employeesPermissions);

  constructor(
    private translate: TranslateService,
    private localStorageService: LocalStorageService,
    private store: Store<IAppState>,
    private jwtService: JwtService
  ) {}

  ngOnInit() {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((lang) => {
      this.translate.setDefaultLang(lang !== 'en' && lang !== 'ua' ? 'ua' : lang);
    });
    const userEmail = this.jwtService.getEmailFromAccessToken();
    this.store.dispatch(GetEmployeesPermissions({ email: userEmail }));
    this.authoritiesSubscription();
  }

  private authoritiesSubscription(): void {
    this.permissions$.pipe(takeUntil(this.destroy)).subscribe((authorities) => {
      this.hasAuthorities = authorities.length > 0;
      this.authorities = authorities;
    });
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
