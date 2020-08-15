import { Component, OnInit, OnDestroy } from '@angular/core';
import { Habit } from '@user-models/habit.model';
import { ProfileStatistics } from '@user-models/profile-statistiscs';
import { ProfileService } from '../../profile-service/profile.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-progress',
  templateUrl: './profile-progress.component.html',
  styleUrls: ['./profile-progress.component.scss'],
})
export class ProfileProgressComponent implements OnInit, OnDestroy {
  public progress: Array<Habit>;
  public progressSubscription: Subscription;

  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.checkUserActivities();
  }

  public checkUserActivities(): void {
    this.progressSubscription = this.profileService.getUserProfileStatistics().subscribe((statistics: ProfileStatistics) => {
      this.setUserProgress(statistics);
    });
  }

  public setUserProgress(item: ProfileStatistics) {
    this.progress = [
      { id: 1, name: 'acquired habits', quantity: item.amountHabitsInProgress },
      { id: 2, name: 'habits in progress', quantity: item.amountHabitsAcquired },
      { id: 3, name: 'written articles', quantity: item.amountWrittenTipsAndTrick },
      { id: 4, name: 'published news', quantity: item.amountPublishedNews },
    ];
  }

  ngOnDestroy() {
    this.progressSubscription.unsubscribe();
  }
}
