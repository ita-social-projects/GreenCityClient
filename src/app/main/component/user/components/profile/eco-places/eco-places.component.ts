import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { EcoPlaces } from '@user-models/ecoPlaces.model';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';

@Component({
  selector: 'app-eco-places',
  templateUrl: './eco-places.component.html',
  styleUrls: ['./eco-places.component.scss']
})
export class EcoPlacesComponent implements OnInit {
  public ecoPlaces: EcoPlaces[] = [];
  public subscription: Subscription;

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.getEcoPlaces();
  }

  public getEcoPlaces(): void {
    this.subscription = this.profileService.getEcoPlaces().subscribe((success: EcoPlaces[]) => (this.ecoPlaces = success));
  }
}
