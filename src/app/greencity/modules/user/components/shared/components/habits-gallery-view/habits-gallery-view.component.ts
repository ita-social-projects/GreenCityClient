import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HabitAssignService } from '@shared/service/habit-assign/habit-assign.service';
import { take } from 'rxjs/operators';
import { HabitInterface } from 'src/app/greencity/modules/user/components/habit/models/interfaces/habit.interface';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { habitImages, starIcons } from 'src/app/greencity/image-paths/habits-images';
import { Observable } from 'rxjs';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';

@Component({
  selector: 'app-habits-gallery-view',
  templateUrl: './habits-gallery-view.component.html',
  styleUrls: ['./habits-gallery-view.component.scss']
})
export class HabitsGalleryViewComponent implements OnInit {
  @Input() habit: HabitInterface;

  whiteStar = starIcons.whiteStar;
  greenStar = starIcons.greenStar;
  calendarGreen = habitImages.calendarGreen;
  man = habitImages.man;
  stars = [this.whiteStar, this.whiteStar, this.whiteStar];
  private userId: number;

  constructor(
    public readonly router: Router,
    public readonly route: ActivatedRoute,
    public readonly snackBar: MatSnackBarService,
    public readonly localStorageService: LocalStorageService,
    public readonly habitAssignService: HabitAssignService
  ) {}

  ngOnInit() {
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
    this.router.navigate(this.habit.assignId ? [`${link}edithabit`, this.habit.assignId] : [`${link}addhabit`, this.habit.id], {
      relativeTo: this.route
    });
  }

  assignStandardHabit(): void {
    this.assignHabit(() => this.habitAssignService.assignHabit(this.habit.id));
  }

  private assignHabit<T>(assignHabit: () => Observable<T>): void {
    let isAssigned = false;
    assignHabit()
      .pipe(take(1))
      .subscribe({
        next: (): void => {
          isAssigned = true;
          this.router.navigate(['profile', this.userId]);
        },
        complete: (): void => {
          this.snackBar.openSnackBar(isAssigned ? 'habitAdded' : 'habitLimitReached');
        }
      });
  }
}
