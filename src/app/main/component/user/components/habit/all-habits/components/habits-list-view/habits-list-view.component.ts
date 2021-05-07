import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { MatSnackBarComponent } from 'src/app/main/component/errors/mat-snack-bar/mat-snack-bar.component';
import { HabitAssignService } from 'src/app/main/service/habit-assign/habit-assign.service';
import { ProfileService } from 'src/app/main/component/user/components/profile/profile-service/profile.service';
import { HabitInterface } from '../../../../../../../interface/habit/habit.interface';

@Component({
  selector: 'app-habits-list-view',
  templateUrl: './habits-list-view.component.html',
  styleUrls: ['./habits-list-view.component.scss'],
})
export class HabitsListViewComponent {
  @Input() habit: HabitInterface;
  private requesting = false;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private snackBar: MatSnackBarComponent,
    public habitAssignService: HabitAssignService,
    public profileService: ProfileService
  ) {}

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
