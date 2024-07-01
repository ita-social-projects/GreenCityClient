import { Component, Input } from '@angular/core';
import { PROFILE_IMAGES } from 'src/app/main/image-pathes/profile-images';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-achievements',
  templateUrl: './users-achievements.component.html',
  styleUrls: ['./users-achievements.component.scss']
})
export class UsersAchievementsComponent {
  achievementsImages = PROFILE_IMAGES.achs;

  @Input() currLang: string;

  constructor(private router: Router) {}

  navigateToAchievements(): void {
    this.router.navigate(['/achievements']);
  }
}
