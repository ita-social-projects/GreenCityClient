import { Component, Input } from '@angular/core';
import { LanguageService } from 'src/app/main/i18n/language.service';

@Component({
  selector: 'app-event-schedule',
  templateUrl: './event-schedule.component.html',
  styleUrls: ['./event-schedule.component.scss']
})
export class EventScheduleComponent {
  icons = {
    clock: 'assets/img/events/clock.svg',
    location: 'assets/img/events/location.svg',
    ellipsis: 'assets/img/events/ellipsis.svg'
  };

  @Input() days = [];
  constructor(private langService: LanguageService) {}

  public getLangValue(uaValue: string, enValue: string): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }
}
