import { Component, Input } from '@angular/core';
import { ProfileStatistics } from '@global-user/models/profile-statistiscs';

@Component({
  selector: 'app-profile-progress',
  templateUrl: './profile-progress.component.html',
  styleUrls: ['./profile-progress.component.scss']
})
export class ProfileProgressComponent {
  @Input() public progress: ProfileStatistics;
}
