import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { switchMap, take } from 'rxjs/operators';
import { Location } from '@angular/common';
import { HabitAssignInterface, HabitResponseInterface } from 'src/app/main/interface/habit/habit-assign.interface';
import { ShoppingList } from '@global-user/models/shoppinglist.model';
import { HabitService } from '@global-service/habit/habit.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ShoppingListService } from './habit-edit-shopping-list/shopping-list.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogMainComponent } from '@shared/components/confirm-dialog-main/confirm-dialog-main.component';

@Component({
  selector: 'app-add-new-habit',
  templateUrl: './add-new-habit.component.html',
  styleUrls: ['./add-new-habit.component.scss']
})
export class AddNewHabitComponent implements OnInit, OnDestroy {
  private langChangeSub: Subscription;
  public habit: HabitAssignInterface;
  public habitResponse: HabitResponseInterface;
  public habitId: number;
  public userId: string;
  public newDuration: number;
  public initialDuration: number;
  public initialShoppingList: ShoppingList[];
  public newList: ShoppingList[];
  public isAssigned = false;
  public whiteStar = 'assets/img/icon/star-2.png';
  public greenStar = 'assets/img/icon/star-1.png';
  public stars = [this.whiteStar, this.whiteStar, this.whiteStar];
  public star: number;
  public popupConfig = {
    title: 'user.habit.add-new-habit.confirmation-modal-title',
    subtitle: 'user.habit.add-new-habit.confirmation-modal-text',
    confirm: 'user.habit.add-new-habit.confirmation-modal-yes',
    cancel: 'user.habit.add-new-habit.confirmation-modal-no',
    hasAdditionalData: true,
    additionalData: {
      dataId: 1,
      name: '',
      userId: ''
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private habitService: HabitService,
    private snackBar: MatSnackBarComponent,
    private habitAssignService: HabitAssignService,
    private shoppingListService: ShoppingListService,
    private localStorageService: LocalStorageService,
    private translate: TranslateService,
    private location: Location
  ) {}

  ngOnInit() {
    this.getUserId();
    this.subscribeToLangChange();
    this.bindLang(this.localStorageService.getCurrentLanguage());
    this.route.params.subscribe((params) => {
      this.habitId = +params.habitId;
      this.popupConfig.additionalData.dataId = this.habitId;
    });
    this.checkIfAssigned();
  }

  private bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }

  private subscribeToLangChange(): void {
    this.langChangeSub = this.localStorageService.languageSubject.subscribe((lang) => {
      this.bindLang(lang);
      this.checkIfAssigned();
    });
  }

  public initHabitData(data) {
    this.habitResponse = data;
    this.getStars(data.complexity);
    this.initialDuration = data.defaultDuration;
    this.initialShoppingList = data.shoppingListItems;
    this.popupConfig.additionalData.name = data.habitTranslation.name;
  }

  public getDefaultItems() {
    this.habitService
      .getHabitById(this.habitId)
      .pipe(take(1))
      .subscribe((data) => {
        this.initHabitData(data);
      });
  }

  public getCustomItems() {
    this.habitAssignService
      .getCustomHabit(this.habitId)
      .pipe(take(1))
      .subscribe((data) => {
        this.initHabitData(data);
      });
  }

  public getStars(complexity: number) {
    for (this.star = 0; this.star < complexity; this.star++) {
      this.stars[this.star] = this.greenStar;
    }
  }

  onGoBack(): void {
    this.location.back();
  }

  private getUserId() {
    this.userId = localStorage.getItem('userId');
    this.popupConfig.additionalData.userId = this.userId;
  }

  public getDuration(newDuration: number) {
    this.newDuration = newDuration;
  }

  public getList(list: ShoppingList[]) {
    this.newList = list;
  }

  public checkIfAssigned() {
    this.habitAssignService
      .getAssignedHabits()
      .pipe(take(1))
      .subscribe((response: Array<HabitAssignInterface>) => {
        for (const assigned of response) {
          if (assigned.habit.id === this.habitId) {
            this.isAssigned = true;
            this.habit = assigned;
            break;
          }
        }
        this.isAssigned ? this.getCustomItems() : this.getDefaultItems();
      });
  }

  giveUpHabit(): void {
    this.dialog.open(ConfirmDialogMainComponent, {
      width: '600px',
      data: this.popupConfig
    });
  }

  public cancelAdd(): void {
    this.router.navigate(['profile', this.userId]);
  }

  public addHabit() {
    const defailtItemsIds = this.newList.filter((item) => item.selected === true).map((item) => item.id);
    this.habitAssignService
      .assignCustomHabit(this.habitId, this.newDuration, defailtItemsIds)
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['profile', this.userId]);
        this.snackBar.openSnackBar('habitAdded');
      });
  }

  public updateHabit() {
    const defailtItemsIds = this.newList.filter((item) => item.selected === true).map((item) => item.id);
    this.habitAssignService
      .updateHabit(this.habitId, this.newDuration, defailtItemsIds)
      .pipe(
        take(1),
        switchMap(() => this.shoppingListService.saveCustomItems(this.userId, this.habitId))
      )
      .subscribe(() => {
        this.router.navigate(['profile', this.userId]);
        this.snackBar.openSnackBar('habitUpdated');
      });
  }

  ngOnDestroy(): void {
    this.langChangeSub.unsubscribe();
  }
}
