import { Component, OnInit } from '@angular/core';

import { quillConfig } from './quillEditorFunc';
import { EventsService } from '../../services/events.service';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';

import Quill from 'quill';
import 'quill-emoji/dist/quill-emoji.js';
import ImageResize from 'quill-image-resize-module';
import { Place } from '../../../places/models/place';
import { DateEvent, Dates, EventDTO, OnlineOflineDto } from '../../models/events.interface';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-edit-events',
  templateUrl: './create-edit-events.component.html',
  styleUrls: ['./create-edit-events.component.scss']
})
export class CreateEditEventsComponent implements OnInit {
  public title = '';
  public dates: DateEvent[] = [];
  private imgArray: Array<File> = [];

  public isOffLine = true;

  public quillModules = {};
  public editorHTML = '';

  public isOpen = true;

  public places: Place[] = [];

  public dateArrCount = ['1 day', '2 days', '3 days', '4 days', '5 days', '6 days', '7 days'];

  filters = [
    { name: 'Environmental', isActive: false },
    { name: 'Social', isActive: true },
    { name: 'economic', isActive: true }
  ];

  ngOnInit(): void {}

  constructor(private eventService: EventsService, public router: Router) {
    this.quillModules = quillConfig;
    Quill.register('modules/imageResize', ImageResize);
  }

  public escapeFromCreateEvent(): void {
    this.router.navigate(['/events']).catch((err) => console.error(err));
  }

  changeToOpen(): void {
    this.isOpen = true;
  }
  changeToClose(): void {
    this.isOpen = false;
  }

  setDateCount(ev: MatSelectChange): void {
    this.dates.length = +ev.value.split(' ')[0];

    for (let i = 0; i < this.dates.length; i++) {
      this.dates[i] = {
        date: '',
        startDate: '',
        finishDate: '',
        coordinatesDto: {
          latitude: null,
          longitude: null
        },
        onlineLink: ''
      };
    }
  }

  getImageTosend(imageArr: Array<File>): void {
    this.imgArray = [...imageArr];
  }

  public getDate(event: string, ind: number): void {
    this.dates[ind].date = event;
  }

  public setStartTime(time: string, ind: number): void {
    this.dates[ind].startDate = time;
  }
  public setEndTime(time: string, ind: number): void {
    this.dates[ind].finishDate = time;
  }

  public changedEditor(event: EditorChangeContent | EditorChangeSelection): void {
    if (event.event !== 'selection-change') {
      this.editorHTML = event.html;
    }
  }

  public setCoordsOnlOff(ev: OnlineOflineDto, i: number): void {
    this.dates[i].coordinatesDto.latitude = ev.latitude;
    this.dates[i].coordinatesDto.longitude = ev.longitude;
    this.dates[i].onlineLink = ev.onlineLink;
  }

  public onSubmit(): void {
    const datesDto = this.dates.reduce((ac, cur) => {
      const date: Dates = {
        startDate: [...cur.date.split('/'), ...cur.startDate.split(':')].map((item) => +item),
        finishDate: [...cur.date.split('/'), ...cur.finishDate.split(':')].map((item) => +item),
        coordinatesDto: {
          latitude: cur.coordinatesDto.latitude,
          longitude: cur.coordinatesDto.longitude
        },
        onlineLink: cur.onlineLink
      };
      ac.push(date);
      return ac;
    }, []);

    const sendEventDto: EventDTO = {
      title: this.title,
      description: this.editorHTML,
      open: this.isOpen,
      dates: datesDto
    };

    const formData: FormData = new FormData();
    const stringifiedDataToSend = JSON.stringify(sendEventDto);
    formData.append('addEventDtoRequest', stringifiedDataToSend);
    for (const images of this.imgArray) {
      formData.append('images', images);
    }

    this.eventService.createEvent(formData).subscribe((res) => res);
  }
}
