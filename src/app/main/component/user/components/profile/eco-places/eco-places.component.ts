import { Subject } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { EcoPlaces } from '@user-models/ecoPlaces.model';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-eco-places',
  templateUrl: './eco-places.component.html',
  styleUrls: ['./eco-places.component.scss']
})
export class EcoPlacesComponent implements OnInit, OnDestroy {
  ecoPlaces: EcoPlaces[] = [];
  destroy$: Subject<void> = new Subject<void>();
  currentLang: string;

  constructor(
    private profileService: ProfileService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.getEcoPlaces();
    this.localStorageService.languageBehaviourSubject.subscribe((lang) => (this.currentLang = lang));
  }

  getEcoPlaces(): void {
    this.profileService
      .getEcoPlaces()
      .pipe(takeUntil(this.destroy$))
      .subscribe((success: EcoPlaces[]) => (this.ecoPlaces = success));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
