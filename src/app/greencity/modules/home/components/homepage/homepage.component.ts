import { CheckTokenService } from 'src/app/shared/services/auth/check-token/check-token.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {
  langChangeSub: Subscription;
  usersAmount: number;
  readonly guyImage = 'assets/img/guy.png';
  readonly path2 = 'assets/img/path-2.svg';
  readonly path4 = 'assets/img/path-4_3.png';
  readonly path5 = 'assets/img/path-5.png';
  private subs = new Subscription();
  userId: number;

  constructor(
    private readonly router: Router,
    private readonly localStorageService: LocalStorageService,
    private readonly userService: UserService,
    public readonly dialog: MatDialog,
    private readonly checkTokenservice: CheckTokenService,
    private readonly translate: TranslateService
  ) {}

  ngOnInit() {
    this.subs.add(this.localStorageService.userIdBehaviourSubject.subscribe((userId) => (this.userId = userId)));
    if (this.userId) {
      this.subs.add(this.userService.countActivatedUsers().subscribe((num) => (this.usersAmount = num)));
    }
    this.onCheckToken();
    this.subscribeToLangChange();
    this.bindLang(this.localStorageService.getCurrentLanguage());
  }

  private bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }

  private subscribeToLangChange(): void {
    this.langChangeSub = this.localStorageService.languageSubject.subscribe(this.bindLang.bind(this));
  }
  startHabit() {
    this.userId ? this.router.navigate(['greenCity/profile', this.userId]) : this.checkTokenservice.openAuthModalWindow();
  }

  private onCheckToken(): void {
    this.subs.add(this.checkTokenservice.onCheckToken());
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
