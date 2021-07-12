import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { take } from 'rxjs/operators';
import { HabitAssignInterface, HabitResponseInterface } from 'src/app/main/interface/habit/habit-assign.interface';
import { ShoppingList } from '@global-user/models/shoppinglist.model';
import { HabitService } from '@global-service/habit/habit.service';

@Component({
  selector: 'app-add-new-habit',
  templateUrl: './add-new-habit.component.html',
  styleUrls: ['./add-new-habit.component.scss']
})
export class AddNewHabitComponent implements OnInit {
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private habitService: HabitService,
    private snackBar: MatSnackBarComponent,
    private habitAssignService: HabitAssignService
  ) {}

  ngOnInit() {
    this.getUserId();
    this.route.params.subscribe((params) => {
      this.habitId = +params.habitId;
    });
    this.checkIfAssigned();
  }

  public initHabitData(data) {
    this.habitResponse = data;
    this.getStars(data.complexity);
    this.initialDuration = data.defaultDuration;
    this.initialShoppingList = data.shoppingListItems;
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

  public goToMyHabits(): void {
    this.router.navigate([`/profile/${this.userId}/allhabits`]);
  }

  private getUserId() {
    this.userId = localStorage.getItem('userId');
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
        response.find((assigned) => {
          if (assigned.habit.id === this.habitId) {
            this.isAssigned = true;
          }
        });
        this.isAssigned ? this.getCustomItems() : this.getDefaultItems();
      });
  }

  public cancel() {
    this.router.navigate(['profile', this.userId]);
  }

  public addHabit() {
    const defailtItemsIds = this.newList.filter((item) => item.selected === true).map((item) => item.id);
    if (defailtItemsIds.length > 0) {
      this.habitAssignService
        .assignCustomHabit(this.habitId, this.newDuration, defailtItemsIds)
        .pipe(take(1))
        .subscribe(() => {
          this.router.navigate(['profile', this.userId]);
          this.snackBar.openSnackBar('habitAdded');
        });
    } else {
      this.habitAssignService
        .assignHabit(this.habitId)
        .pipe(take(1))
        .subscribe(() => {
          this.router.navigate(['profile', this.userId]);
          this.snackBar.openSnackBar('habitAdded');
        });
    }
  }

  public updateHabit() {
    const defailtItemsIds = this.newList.filter((item) => item.selected === true).map((item) => item.id);
    this.habitAssignService
      .updateHabit(this.habitId, this.newDuration, defailtItemsIds)
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['profile', this.userId]);
        this.snackBar.openSnackBar('habitUpdated');
      });
  }

  public deleteHabit() {
    this.habitAssignService
      .deleteHabitById(this.habitId)
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['profile', this.userId]);
        this.snackBar.openSnackBar('habitDeleted');
      });
  }
}
