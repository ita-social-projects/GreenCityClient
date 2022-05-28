import { MapsAPILoader } from '@agm/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventPageResponceDto, EventResponseDto } from '../../models/events.interface';
import { EventsService } from '../../services/events.service';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit, OnDestroy {
  eventsList: EventPageResponceDto[] = [];

  public isLoggedIn: string;
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);

  public total = 0;
  public page = 0;

  constructor(private eventService: EventsService, private userOwnAuthService: UserOwnAuthService) {}

  ngOnInit(): void {
    this.checkUserSingIn();
    this.userOwnAuthService.getDataFromLocalStorage();

    this.eventService.getEvents(this.page, 9).subscribe((res: EventResponseDto) => {
      this.eventsList = [...res.page];
      this.total = res.totalElements;
    });
  }

  private checkUserSingIn(): void {
    this.userOwnAuthService.credentialDataSubject.subscribe((data) => (this.isLoggedIn = data && data.userId));
  }

  public setPage(event: number) {
    this.page = event;
    this.eventService.getEvents(event - 1, 9).subscribe((res: EventResponseDto) => {
      this.eventsList = [...res.page];
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
