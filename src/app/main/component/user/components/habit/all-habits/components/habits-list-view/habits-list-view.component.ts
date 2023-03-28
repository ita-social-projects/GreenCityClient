import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { HabitInterface } from '../../../../../../../interface/habit/habit.interface';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { HabitService } from '@global-service/habit/habit.service';

@Component({
  selector: 'app-habits-list-view',
  templateUrl: './habits-list-view.component.html',
  styleUrls: ['./habits-list-view.component.scss']
})
export class HabitsListViewComponent implements OnInit {
  @Input() habit: HabitInterface;
  private userId: number;
  public whiteStar = 'assets/img/icon/star-2.png';
  public greenStar = 'assets/img/icon/star-1.png';
  public stars = [this.whiteStar, this.whiteStar, this.whiteStar];
  public star: number;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private snackBar: MatSnackBarComponent,
    public habitAssignService: HabitAssignService,
    private habitService: HabitService,
    public localStorage: LocalStorageService
  ) {}

  ngOnInit() {
    this.getStars(this.habit.complexity);
    this.userId = this.localStorage.getUserId();
  }

  public getStars(complexity: number) {
    for (this.star = 0; this.star < complexity; this.star++) {
      this.stars[this.star] = this.greenStar;
    }
  }

  public goHabitMore(): void {
    const habit = {
      id: this.habit.id,
      assignId: this.habit.assignId,
      userId: this.userId
    };
    this.habitService.goToAddOrEditHabit(habit, this.router, this.route);
  }

  public addHabit() {
    this.habitAssignService
      .assignHabit(this.habit.id)
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['profile', this.userId]);
        this.snackBar.openSnackBar('habitAdded');
      });
  }
}
