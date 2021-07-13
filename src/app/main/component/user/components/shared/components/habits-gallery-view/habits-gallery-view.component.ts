import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { take } from 'rxjs/operators';

import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { HabitInterface } from '../../../../../../interface/habit/habit.interface';

@Component({
  selector: 'app-habits-gallery-view',
  templateUrl: './habits-gallery-view.component.html',
  styleUrls: ['./habits-gallery-view.component.scss']
})
export class HabitsGalleryViewComponent implements OnInit {
  @Input() habit: HabitInterface;
  private requesting = false;
  public whiteStar = 'assets/img/icon/star-2.png';
  public greenStar = 'assets/img/icon/star-1.png';
  public stars = [this.whiteStar, this.whiteStar, this.whiteStar];
  public star: number;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private snackBar: MatSnackBarComponent,
    public habitAssignService: HabitAssignService,
    public profileService: ProfileService
  ) {}

  ngOnInit() {
    this.getStars(this.habit.complexity);
  }

  public getStars(complexity: number) {
    for (this.star = 0; this.star < complexity; this.star++) {
      this.stars[this.star] = this.greenStar;
    }
  }

  public goHabitMore() {
    this.router.navigate(['addhabit', this.habit.id], { relativeTo: this.route });
  }

  public addHabit() {
    this.requesting = true;
    this.habitAssignService
      .assignHabit(this.habit.id)
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['profile', this.profileService.userId]);
        this.snackBar.openSnackBar('habitAdded');
      });
  }
}
