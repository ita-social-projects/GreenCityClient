import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { take } from 'rxjs/operators';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { HabitInterface } from '@global-user/components/habit/models/interfaces/habit.interface';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { HabitAssignPropertiesDto } from '@global-models/goal/HabitAssignCustomPropertiesDto';
import { starIcons } from 'src/app/main/image-pathes/habits-images';

@Component({
  selector: 'app-habits-gallery-view',
  templateUrl: './habits-gallery-view.component.html',
  styleUrls: ['./habits-gallery-view.component.scss']
})
export class HabitsGalleryViewComponent implements OnInit {
  @Input() habit: HabitInterface;

  whiteStar = starIcons.whiteStar;
  greenStar = starIcons.greenStar;
  stars = [this.whiteStar, this.whiteStar, this.whiteStar];
  star: number;

  private userId: number;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public snackBar: MatSnackBarComponent,
    public localStorageService: LocalStorageService,
    public habitAssignService: HabitAssignService
  ) {}

  ngOnInit(): void {
    this.getStars(this.habit.complexity);
    this.userId = this.localStorageService.getUserId();
  }

  getStars(complexity: number): void {
    this.stars = Array(this.stars.length)
      .fill(this.whiteStar)
      .map((star, index) => (index < complexity ? this.greenStar : star));
  }

  goHabitMore(): void {
    const link = `/profile/${this.userId}/allhabits/`;
    this.habit.assignId
      ? this.router.navigate([`${link}edithabit`, this.habit.assignId], { relativeTo: this.route })
      : this.router.navigate([`${link}addhabit`, this.habit.id], { relativeTo: this.route });
  }

  addHabit(): void {
    this.habit.isCustomHabit ? this.assignCustomHabit() : this.assignStandardHabit();
  }

  private assignStandardHabit(): void {
    this.habitAssignService
      .assignHabit(this.habit.id)
      .pipe(take(1))
      .subscribe(() => {
        this.afterHabitWasChanged();
      });
  }

  private assignCustomHabit(): void {
    const habitAssignProperties: HabitAssignPropertiesDto = {
      defaultShoppingListItems: [],
      duration: this.habit.defaultDuration
    };

    this.habitAssignService
      .assignCustomHabit(this.habit.id, [], habitAssignProperties)
      .pipe(take(1))
      .subscribe(() => {
        this.afterHabitWasChanged();
      });
  }

  private afterHabitWasChanged(): void {
    this.router.navigate(['profile', this.userId]);
    this.snackBar.openSnackBar('habitAdded');
  }
}
