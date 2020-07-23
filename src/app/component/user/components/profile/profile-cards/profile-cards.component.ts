import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile-service/profile.service';

@Component({
  selector: 'app-profile-cards',
  templateUrl: './profile-cards.component.html',
  styleUrls: ['./profile-cards.component.scss']
})
export class ProfileCardsComponent implements OnInit {

   constructor(private profileService: ProfileService) { }

   public profileSubscription;
   public facts = [];

  ngOnInit() {
    this.profileSubscription = this.profileService.getFactsOfTheDay().subscribe(
      (success) => {
        this.facts = [success, ...this.facts];
      }
    );
  }
}
