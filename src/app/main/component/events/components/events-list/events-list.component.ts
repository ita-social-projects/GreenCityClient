import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventPageResponceDto, EventResponseDto, PaginationInterface } from '../../models/events.interface';
import { EventsService } from '../../services/events.service';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit, OnDestroy {
  public eventsList: EventPageResponceDto[] = [];

  public isLoggedIn: string;
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);

  public items = 9;
  public total = 0;
  public page = 0;

  public pageConfig(items: number, page: number, total: number): PaginationInterface {
    return {
      itemsPerPage: items,
      currentPage: page,
      totalItems: total
    };
  }

  constructor(
    private eventService: EventsService,
    private userOwnAuthService: UserOwnAuthService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.localStorageService.setEditMode('canUserEdit', false);
    this.checkUserSingIn();
    this.userOwnAuthService.getDataFromLocalStorage();

    this.eventService.getEvents(this.page, 9).subscribe((res: EventResponseDto) => {
      this.eventsList = [...res.page];
      this.total = res.totalElements;
    });
  }

  public checkPagination(): boolean {
    return this.total > this.items;
  }

  private checkUserSingIn(): void {
    this.userOwnAuthService.credentialDataSubject.subscribe((data) => (this.isLoggedIn = data && data.userId));
  }

  public setPage(event: number): void {
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
