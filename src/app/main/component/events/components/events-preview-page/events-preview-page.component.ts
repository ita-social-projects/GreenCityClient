import { Component, OnInit } from '@angular/core';
import { singleNewsImages } from '../../../../image-pathes/single-news-images';
import { LanguageService } from '../../../../i18n/language.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { EventsService } from '../../services/events.service';
import { PagePreviewDTO } from '../../models/events.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-events-preview-page',
  templateUrl: './events-preview-page.component.html',
  styleUrls: ['./events-preview-page.component.scss']
})
export class EventsPreviewPageComponent implements OnInit {
  public images = singleNewsImages;
  public event: PagePreviewDTO;
  public date: string;
  public addressUa: string;
  public addressEn: string;
  public userName: string;
  private userNameSub: Subscription;
  firstFriend = 'assets/img/kimi.png';
  secondFriend = 'assets/img/lewis.png';
  public icons = {
    socials: {
      plus: 'assets/img/events/plus.svg',
      twitter: 'assets/img/events/twitter.svg',
      linkedin: 'assets/img/events/linkedin.svg',
      facebook: 'assets/img/events/facebook.svg'
    },
    clock: 'assets/img/events/clock.svg',
    location: 'assets/img/events/location.svg',
    lock: {
      open: 'assets/img/events/lock.svg',
      closed: 'assets/img/events/lock-closed.svg'
    },
    user: 'assets/img/events/user.svg',
    ellipsis: 'assets/img/events/ellipsis.svg',
    arrowLeft: 'assets/img/icon/econews/arrow_left.svg'
  };
  constructor(
    private localStorageService: LocalStorageService,
    private languageService: LanguageService,
    public eventService: EventsService
  ) {}

  ngOnInit() {
    this.event = this.eventService.getForm();
    this.date = new Date(this.event.datesLocations[0].date).toDateString();
    this.bindUserName();
  }

  private bindUserName(): void {
    this.userNameSub = this.localStorageService.firstNameBehaviourSubject.subscribe((name) => {
      this.userName = name;
    });
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.languageService.getLangValue(uaValue, enValue) as string;
  }
}
