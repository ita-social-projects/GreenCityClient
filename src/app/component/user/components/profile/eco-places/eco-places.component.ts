import { EcoPlaces } from './../../../models/ecoPlaces.model';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eco-places',
  templateUrl: './eco-places.component.html',
  styleUrls: ['./eco-places.component.scss']
})
export class EcoPlacesComponent implements OnInit {
  public ecoPlaces: EcoPlaces[] = [];

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.getEcoPlaces();
  }

  public getEcoPlaces(): Array<object> {
    return this.profileService.getEcoPlaces().subscribe(success => this.ecoPlaces = success);
  }
}
