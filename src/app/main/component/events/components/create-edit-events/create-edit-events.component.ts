import { Component, Injector, OnInit } from '@angular/core';

import { quillConfig } from './quillEditorFunc';
import { EventsService } from '../../services/events.service';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';

import Quill from 'quill';
import 'quill-emoji/dist/quill-emoji.js';
import ImageResize from 'quill-image-resize-module';
import { Place } from '../../../places/models/place';
import { DateEvent, DateFormObj, Dates, EventDTO, OfflineDto, TagObj } from '../../models/events.interface';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-create-edit-events',
  templateUrl: './create-edit-events.component.html',
  styleUrls: ['./create-edit-events.component.scss']
})
export class CreateEditEventsComponent implements OnInit {
  public title = '';
  public dates: DateEvent[] = [];
  private imgArray: Array<File> = [];
  private snackBar: MatSnackBarComponent;

  public quillModules = {};
  public editorHTML = '';

  public isOpen = true;

  public places: Place[] = [];

  public checkdates: boolean;

  public isPosting = false;
  public contentValid: boolean;
  public checkAfterSend = true;

  private pipe = new DatePipe('en-US');

  public dateArrCount = ['1 day', '2 days', '3 days', '4 days', '5 days', '6 days', '7 days'];

  filters: Array<TagObj> = [
    { name: 'Environmental', isActive: false },
    { name: 'Social', isActive: true },
    { name: 'Economic', isActive: true }
  ];

  titleForm: FormControl;

  ngOnInit(): void {
    this.titleForm = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(70)]);
  }

  constructor(private eventService: EventsService, public router: Router, private injector: Injector) {
    this.quillModules = quillConfig;
    Quill.register('modules/imageResize', ImageResize);
    this.snackBar = injector.get(MatSnackBarComponent);
  }

  public checkTab(tag: TagObj): void {
    tag.isActive = !tag.isActive;
  }

  public checkForm(form: DateFormObj, ind: number): void {
    this.dates[ind].date = form.date;
    this.dates[ind].startDate = form.startTime;
    this.dates[ind].finishDate = form.endTime;
    this.dates[ind].onlineLink = form.onlineLink;
  }

  public checkStatus(event: boolean, ind: number): void {
    this.dates[ind].valid = event;
  }

  public escapeFromCreateEvent(): void {
    this.router.navigate(['/events']);
  }

  public changeToOpen(): void {
    this.isOpen = true;
  }

  public changeToClose(): void {
    this.isOpen = false;
  }

  public setDateCount(event: MatSelectChange): void {
    this.dates.length = +event.value.split(' ')[0];

    for (let i = 0; i < this.dates.length; i++) {
      this.dates[i] = {
        date: null,
        startDate: '',
        finishDate: '',
        coordinatesDto: {
          latitude: null,
          longitude: null
        },
        onlineLink: '',
        valid: false,
        check: false
      };
    }
  }

  public getImageTosend(imageArr: Array<File>): void {
    this.imgArray = [...imageArr];
  }

  public changedEditor(event: EditorChangeContent | EditorChangeSelection): void {
    if (event.event !== 'selection-change') {
      this.editorHTML = event.html;
      this.contentValid = !(event.text.length < 20 || event.text.length > 63206);
    }
  }

  public setCoordsOnlOff(event: OfflineDto, ind: number): void {
    this.dates[ind].coordinatesDto.latitude = event.latitude;
    this.dates[ind].coordinatesDto.longitude = event.longitude;
  }

  private checkDates() {
    this.dates.forEach((item) => {
      item.check = !item.valid;
    });

    this.checkdates = this.dates.find((element) => !element.valid) ? false : true;
  }

  private getFormattedDate(dateString: Date, hour: number, min: number) {
    const date = new Date(dateString);
    date.setHours(hour, min);
    return date.toString();
  }

  private createDates() {
    return this.dates.reduce((ac, cur) => {
      if (!cur.startDate) {
        cur.startDate = '00 : 00';
      }
      if (!cur.finishDate) {
        cur.finishDate = '23 : 59';
      }
      const start = this.getFormattedDate(cur.date, +cur.startDate.split(':')[0], +cur.startDate.split(':')[1]);
      const end = this.getFormattedDate(cur.date, +cur.finishDate.split(':')[0], +cur.finishDate.split(':')[1]);

      const date: Dates = {
        startDate: this.pipe.transform(start, 'yyyy-MM-ddTHH:mm:ssZZZZZ'),
        finishDate: this.pipe.transform(end, 'yyyy-MM-ddTHH:mm:ssZZZZZ'),
        coordinates: {
          latitude: cur.coordinatesDto.latitude,
          longitude: cur.coordinatesDto.longitude
        },
        onlineLink: cur.onlineLink
      };
      ac.push(date);
      return ac;
    }, []);
  }

  public onSubmit(): void {
    this.checkDates();

    let datesDto: Array<Dates>;
    if (this.checkdates) {
      datesDto = this.createDates();
    }

    const tagsArr: Array<string> = this.filters.filter((tag) => tag.isActive).reduce((ac, cur) => [...ac, cur.name], []);

    const sendEventDto: EventDTO = {
      title: this.titleForm.value,
      description: this.editorHTML,
      open: this.isOpen,
      datesLocations: datesDto,
      tags: tagsArr
    };

    if (this.checkdates && this.titleForm.valid && this.contentValid) {
      this.checkAfterSend = true;
      const formData: FormData = new FormData();
      const stringifiedDataToSend = JSON.stringify(sendEventDto);
      formData.append('addEventDtoRequest', stringifiedDataToSend);
      this.imgArray.forEach((item) => {
        formData.append('images', item);
      });

      this.isPosting = true;
      this.eventService
        .createEvent(formData)
        .pipe(
          catchError((err) => {
            this.snackBar.openSnackBar('Oops, something went wrong. Please reload page or try again later.');
            this.router.navigate(['/events']);
            return throwError(err);
          })
        )
        .subscribe(() => {
          this.isPosting = false;
          this.router.navigate(['/events']);
        });
    } else {
      this.titleForm.markAsTouched();
      this.checkAfterSend = false;
    }
  }
}
