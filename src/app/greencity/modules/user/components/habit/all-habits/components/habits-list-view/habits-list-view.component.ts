import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HabitAssignService } from '@shared/service/habit-assign/habit-assign.service';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { HabitsGalleryViewComponent } from 'src/app/greencity/modules/user/components/shared/components/habits-gallery-view/habits-gallery-view.component';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';

@Component({
  selector: 'app-habits-list-view',
  templateUrl: './habits-list-view.component.html',
  styleUrls: ['./habits-list-view.component.scss']
})
export class HabitsListViewComponent extends HabitsGalleryViewComponent {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public snackBar: MatSnackBarService,
    public localStorageService: LocalStorageService,
    public habitAssignService: HabitAssignService
  ) {
    super(router, route, snackBar, localStorageService, habitAssignService);
  }
}
