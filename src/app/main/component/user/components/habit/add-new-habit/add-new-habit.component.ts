import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { take } from 'rxjs/operators';
import { HabitAssignInterface, HabitResponseInterface } from 'src/app/main/interface/habit/habit-assign.interface';
import { AllShoppingLists, CustomShoppingItem, HabitUpdateShopList, ShoppingList } from '@global-user/models/shoppinglist.model';
import { HabitService } from '@global-service/habit/habit.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ShoppingListService } from './habit-edit-shopping-list/shopping-list.service';
import { MatDialog } from '@angular/material/dialog';
import { WarningPopUpComponent } from '@shared/components';

@Component({
  selector: 'app-add-new-habit',
  templateUrl: './add-new-habit.component.html',
  styleUrls: ['./add-new-habit.component.scss']
})
export class AddNewHabitComponent implements OnInit, OnDestroy {
  private langChangeSub: Subscription;
  public assignedHabit: HabitAssignInterface;
  public habitResponse: HabitResponseInterface;
  public habitId: number;
  private habitAssignId: number;
  public tags: string[];
  public recommendedHabits: HabitResponseInterface;
  public amountAcquired = 6;
  public userId: number;
  private currentLang: string;
  public newDuration: number;
  public initialDuration: number;
  public initialShoppingList: ShoppingList[];
  public standartShopList: ShoppingList[];
  public customShopList: ShoppingList[];
  public isAssigned = false;
  public isAcquited = false;
  public canAcquire = false;
  private enoughToAcquire = 80;
  public setStatus = 'ACQUIRED';
  public isEditing = false;
  public whiteStar = 'assets/img/icon/star-2.png';
  public greenStar = 'assets/img/icon/star-1.png';
  public stars = [this.whiteStar, this.whiteStar, this.whiteStar];
  public star: number;
  public popUpGiveUp = {
    title: 'user.habit.add-new-habit.confirmation-modal-title',
    subtitle: 'user.habit.add-new-habit.confirmation-modal-text',
    confirm: 'user.habit.add-new-habit.confirmation-modal-yes',
    cancel: 'user.habit.add-new-habit.confirmation-modal-no'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private habitService: HabitService,
    private snackBar: MatSnackBarComponent,
    private habitAssignService: HabitAssignService,
    private shopListService: ShoppingListService,
    private localStorageService: LocalStorageService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.getUserId();
    this.subscribeToLangChange();
    this.bindLang(this.localStorageService.getCurrentLanguage());
    this.route.params.subscribe((params) => {
      if (this.router.url.includes('add')) {
        this.habitId = +params.habitId;
      }
      if (this.router.url.includes('edit')) {
        this.isEditing = true;
        this.habitAssignId = +params.habitAssignId;
      }
    });
    this.checkIfAssigned();
  }

  private bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
    this.currentLang = lang;
  }

  private subscribeToLangChange(): void {
    this.langChangeSub = this.localStorageService.languageSubject.subscribe((lang) => {
      this.bindLang(lang);
      this.checkIfAssigned();
    });
  }

  public checkIfAssigned(): void {
    if (this.isEditing) {
      this.habitAssignService
        .getHabitByAssignId(this.habitAssignId)
        .pipe(take(1))
        .subscribe((res) => {
          this.assignedHabit = res;
          this.habitId = this.assignedHabit.habit.id;
          this.isAcquited = this.assignedHabit.status === 'ACQUIRED';
          this.initHabitData(res.habit);
          this.getCustomShopList();
        });
    }
    if (!this.isEditing) {
      this.getDefaultHabit();
      this.getStandartShopList();
    }
  }

  public getDefaultHabit(): void {
    this.habitService
      .getHabitById(this.habitId)
      .pipe(take(1))
      .subscribe((data) => {
        this.initHabitData(data);
      });
  }

  private initHabitData(habit): void {
    this.habitResponse = habit;
    this.tags = habit.tags;
    this.getStars(habit.complexity);
    this.initialDuration = habit.defaultDuration;
  }

  public getStars(complexity: number): void {
    for (this.star = 0; this.star < complexity; this.star++) {
      this.stars[this.star] = this.greenStar;
    }
  }

  onGoBack(): void {
    this.router.navigate(['/profile']);
  }

  private getUserId() {
    this.userId = this.localStorageService.getUserId();
  }

  public getDuration(newDuration: number): void {
    this.newDuration = newDuration;
  }

  public getProgressValue(progress: number): void {
    this.canAcquire = progress >= this.enoughToAcquire;
  }

  public getList(list: ShoppingList[]): void {
    this.standartShopList = list.filter((item) => !item.custom);
    this.customShopList = list.filter((item) => item.custom);
  }

  private getStandartShopList(): void {
    this.shopListService
      .getHabitShopList(this.habitId)
      .pipe(take(1))
      .subscribe((res) => {
        this.initialShoppingList = res;
      });
  }

  private getCustomShopList(): void {
    this.shopListService
      .getHabitAllShopLists(this.habitId, this.currentLang)
      .pipe(take(1))
      .subscribe((res: AllShoppingLists) => {
        res.customShoppingListItemDto.forEach((item) => (item.custom = true));
        this.initialShoppingList = [...res.customShoppingListItemDto, ...res.userShoppingListItemDto];
      });
  }

  public giveUpHabit(): void {
    const dialogRef = this.dialog.open(WarningPopUpComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'popup-dialog-container',
      data: {
        popupTitle: this.popUpGiveUp.title,
        popupSubtitle: this.popUpGiveUp.subtitle,
        popupConfirm: this.popUpGiveUp.confirm,
        popupCancel: this.popUpGiveUp.cancel,
        isHabit: true,
        habitName: this.habitResponse.habitTranslation.name
      }
    });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirm) => {
        if (confirm) {
          this.habitAssignService
            .deleteHabitById(this.habitId)
            .pipe(take(1))
            .subscribe(() => {
              this.goToProfile();
              this.snackBar.openSnackBar('habitDeleted');
            });
        }
        if (!confirm) {
          this.snackBar.openSnackBar('habitDidNotGiveUp');
        }
      });
  }

  public goToProfile(): void {
    this.router.navigate(['profile', this.userId]);
  }

  public addHabit(): void {
    const defailtItemsIds = this.standartShopList.filter((item) => item.selected === true).map((item) => item.id);
    this.habitAssignService
      .assignCustomHabit(this.habitId, this.newDuration, defailtItemsIds)
      .pipe(take(1))
      .subscribe(() => {
        if (this.customShopList && this.customShopList.length) {
          this.addCustomHabitItems();
        }
        if (!this.customShopList) {
          this.goToProfile();
          this.snackBar.openSnackBar('habitAdded');
        }
      });
  }

  private addCustomHabitItems(): void {
    const customItemsList: CustomShoppingItem[] = this.customShopList.map((item) => ({
      text: item.text
    }));
    this.shopListService
      .addHabitCustomShopList(this.userId, this.habitId, customItemsList)
      .pipe(take(1))
      .subscribe(() => {
        this.goToProfile();
        this.snackBar.openSnackBar('habitAdded');
      });
  }

  public updateHabit(): void {
    if (this.customShopList || this.standartShopList) {
      this.convertShopLists();
      const habitShopListUpdate = this.setHabitListForUpdate();
      this.shopListService
        .updateHabitShopList(habitShopListUpdate)
        .pipe(take(1))
        .subscribe(() => {
          this.goToProfile();
          this.snackBar.openSnackBar('habitUpdated');
        });
    }
  }

  private convertShopLists(): void {
    this.customShopList.forEach((el) => {
      delete el.custom;
      delete el.selected;
    });
    this.standartShopList.forEach((el) => {
      delete el.custom;
      delete el.selected;
    });
  }

  private setHabitListForUpdate(): HabitUpdateShopList {
    const shopListUpdate: HabitUpdateShopList = {
      habitId: this.habitId,
      customShopList: this.customShopList,
      standartShopList: this.standartShopList,
      lang: this.currentLang
    };
    return shopListUpdate;
  }

  public setHabitStatus(): void {
    this.habitAssignService
      .setHabitStatus(this.habitId, this.setStatus)
      .pipe(take(1))
      .subscribe(() => {
        this.goToProfile();
        this.snackBar.openSnackBar('habitAcquired');
      });
  }

  ngOnDestroy(): void {
    this.langChangeSub.unsubscribe();
  }
}
