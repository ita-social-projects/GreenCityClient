import { Pipe, PipeTransform } from '@angular/core';
import { Message } from '../../model/Message.model';

@Pipe({
  name: 'messageFromDay',
  pure: false
})
export class MessageFromDayPipe implements PipeTransform {
  transform(messages: Message[]): Array<Message[]> {
    const result = [];
    const currentDay = [messages[0]];
    for (let i = 1; i < messages.length; i++) {
      const message = messages[i];
      const nextMessageDate = messages[i - 1].messageDate;
      const messageDate = message.messageDate;
      if (!sameDay(messageDate, nextMessageDate)) {
        result.push([...currentDay]);
        currentDay.length = 0;
      }
      currentDay.push(message);
    }
    result.push([...currentDay]);
    return result;
  }
}

function sameDay(d1, d2) {
  d1 = new Date(d1);
  d2 = new Date(d2);
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}
