import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { HabitsGalleryViewComponent } from '@global-user/components/shared/components/habits-gallery-view/habits-gallery-view.component';

@Component({
  selector: 'app-habits-list-view',
  templateUrl: './habits-list-view.component.html',
  styleUrls: ['./habits-list-view.component.scss']
})
export class HabitsListViewComponent extends HabitsGalleryViewComponent {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public snackBar: MatSnackBarComponent,
    public localStorageService: LocalStorageService,
    public habitAssignService: HabitAssignService
  ) {
    super(router, route, snackBar, localStorageService, habitAssignService);
  }
}
