import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { quillConfig } from './quillEditorFunc';
import { EventsService } from '../../services/events.service';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';

import Quill from 'quill';
import 'quill-emoji/dist/quill-emoji.js';
import ImageResize from 'quill-image-resize-module';
import { Place } from '../../../places/models/place';
import { Coords, DateEvent, EventDTO } from '../../models/events.interface';

@Component({
  selector: 'app-create-edit-events',
  templateUrl: './create-edit-events.component.html',
  styleUrls: ['./create-edit-events.component.scss']
})
export class CreateEditEventsComponent implements OnInit {
  public title = '';
  public dates: DateEvent[] = [];
  private imgArray: Array<File> = [];

  private maxNumberOfDates = 7;

  public isOffLine = true;
  public onlineLink = '';
  private latitude: number;
  private longitude: number;

  public quillModules = {};
  public editorHTML = '';

  public places: Place[] = [];

  constructor(private eventService: EventsService) {
    this.quillModules = quillConfig;
    Quill.register('modules/imageResize', ImageResize);
  }

  @ViewChild('takeInput') InputVar: ElementRef;

  ngOnInit(): void {}

  getImageTosend(imageArr: Array<File>) {
    this.imgArray = [...imageArr];
  }

  public getDate(event: Date, ind: number): void {
    this.dates[ind].title = `date ${ind + 1}`;
    this.dates[ind].date = event;
  }

  public setStartTime(time: string, ind: number) {
    this.dates[ind].timeStart = time;
  }
  public setEndTime(time: string, ind: number) {
    this.dates[ind].timeEnd = time;
  }

  public addDate(): void {
    if (this.dates.length < this.maxNumberOfDates) {
      const newDate: DateEvent = {
        title: '',
        date: null,
        timeStart: '',
        timeEnd: ''
      };
      this.dates.push(newDate);
    }
  }

  public deleteDate(ind: number) {
    this.dates.splice(ind, 1);
  }

  public changedEditor(event: EditorChangeContent | EditorChangeSelection): void {
    if (event.event !== 'selection-change') {
      this.editorHTML = event.html;
    }
  }

  public addMarker(ev: Coords) {
    this.latitude = ev.coords.lat;
    this.longitude = ev.coords.lng;
  }

  public onSubmit() {
    if (this.isOffLine) {
      this.onlineLink = '';
    }
    if (!this.isOffLine) {
      this.latitude = null;
      this.longitude = null;
    }

    const sendEventDto: EventDTO = {
      title: this.title,
      content: this.editorHTML,
      dates: this.dates,
      onlineLink: this.onlineLink,
      location: {
        latitude: this.latitude,
        longitude: this.longitude
      }
    };

    const formData: FormData = new FormData();
    const stringifiedDataToSend = JSON.stringify(sendEventDto);
    formData.append('dto', stringifiedDataToSend);
    for (const images of this.imgArray) {
      formData.append('image', images);
    }
    // console.log(formData.getAll('dto'));
    // console.log(formData.getAll('image'));
    return formData;
  }
}
