import { Pipe, PipeTransform } from '@angular/core';
import { FilterOfEvent } from '../../models/events.interface';

@Pipe({
  name: 'eventListFilter'
})
export class EventListFilterPipe implements PipeTransform {
  currentDate = new Date().getTime();
  transform(eventList: any[], conditionsArray: any[], userId?: number): any[] {
    if (!eventList || conditionsArray.length === 0 || !conditionsArray) {
      return eventList;
    }

    const filteredArray = eventList.filter((event) => {
      return conditionsArray.some((conditions) => {
        if (
          // Status
          (conditions.nameEn === FilterOfEvent.closed && !event.open) ||
          (conditions.nameEn === FilterOfEvent.open && event.open) ||
          (conditions.nameEn === FilterOfEvent.joined && event.isSubscribed) ||
          (conditions.nameEn === FilterOfEvent.created && +userId === event.organizer.id) ||
          // type of event
          event.tags.some((it) => it.nameEn === conditions.nameEn) ||
          // time filter
          (conditions.nameEn === FilterOfEvent.upcoming && this.currentDate < new Date(event.dates[0]?.finishDate).getTime()) ||
          (conditions.nameEn === FilterOfEvent.passed && this.currentDate > new Date(event.dates[0]?.finishDate).getTime()) ||
          event.dates[0].coordinates?.cityEn === conditions.nameEn
        ) {
          return true;
        }
        return false;
      });
    });
    return filteredArray;
  }
}
