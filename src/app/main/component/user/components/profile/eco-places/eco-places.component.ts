import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { EcoPlaces } from '@user-models/ecoPlaces.model';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Component({
  selector: 'app-eco-places',
  templateUrl: './eco-places.component.html',
  styleUrls: ['./eco-places.component.scss']
})
export class EcoPlacesComponent implements OnInit {
  public ecoPlaces: EcoPlaces[] = [];
  public subscription: Subscription;
  public currentLang: string;

  constructor(private profileService: ProfileService, private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.getEcoPlaces();
    this.localStorageService.languageBehaviourSubject.subscribe((lang) => (this.currentLang = lang));
  }

  public getEcoPlaces(): void {
    this.subscription = this.profileService.getEcoPlaces().subscribe((success: EcoPlaces[]) => (this.ecoPlaces = success));
  }
}
