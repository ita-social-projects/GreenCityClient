import { Component, OnInit } from '@angular/core';
import { ProfileStatistics } from '@user-models/profile-statistiscs';
import { ProfileService } from '../../profile-service/profile.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-profile-progress',
  templateUrl: './profile-progress.component.html',
  styleUrls: ['./profile-progress.component.scss']
})
export class ProfileProgressComponent implements OnInit {
  public progress: ProfileStatistics;
  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.checkUserActivities();
  }

  public checkUserActivities(): void {
    this.profileService
      .getUserProfileStatistics()
      .pipe(take(1))
      .subscribe((statistics: ProfileStatistics) => {
        this.progress = statistics;
      });
  }
}
