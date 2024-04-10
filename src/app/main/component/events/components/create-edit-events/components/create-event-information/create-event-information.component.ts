import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ContentChange } from 'ngx-quill';

import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, ɵGetProperty } from '@angular/forms';

import { quillConfig } from '../../quillEditorFunc';

import { EVENT_LOCALE, EventLocaleKeys } from '../../../../models/event-consts';
import { PagePreviewDTO } from '../../../../models/events.interface';
import { EventsService } from '../../../../services/events.service';
import { Router } from '@angular/router';
import { quillEditorValidator } from '../../validators/quillEditorValidator';

@Component({
  selector: 'app-create-event-information',
  templateUrl: './create-event-information.component.html',
  styleUrls: ['./create-event-information.component.scss']
})
export class CreateEventInformationComponent implements OnInit {
  protected readonly EVENT_LOCALE = EVENT_LOCALE;

  isQuillUnfilled = false;
  quillLength = 0;
  quillModules = null;
  imgArray: string[] = [];
  // TODO CHANGE VALUE TO INITIAL
  eventInfForm = this.fb.group({
    title: ['TitleTest', [Validators.required, Validators.maxLength(70)]],
    duration: [1, Validators.required],
    description: ['', [quillEditorValidator(), Validators.required]],
    open: [null, Validators.required],
    tags: [[], [Validators.required, Validators.minLength(1)]]
  });

  constructor(
    protected localStorageService: LocalStorageService,
    protected fb: FormBuilder,
    protected eventsService: EventsService,
    protected router: Router
  ) {}

  ngOnInit() {
    this.quillModules = quillConfig;
    this.eventInfForm.valueChanges.subscribe((value) => {
      console.log(value);
      console.log(this.eventInfForm.invalid);
    });
  }

  quillContentChanged(content: ContentChange) {
    this.quillLength = content.text.length - 1;
    this.eventInfForm.get('description').setValue(content.text.trimEnd());
  }

  quillValidate() {
    this.isQuillUnfilled = this.quillLength < 20;
  }

  getLocale(localeKey: EventLocaleKeys): string {
    return EVENT_LOCALE[localeKey][this.localStorageService.getCurrentLanguage()];
  }

  setImgArray(value: string[]) {
    this.imgArray = value;
  }

  test() {
    console.log(this.eventInfForm.getRawValue());
  }

  // TODO tags must be in en name
  onPreview() {
    const formVal = this.eventInfForm.value;
    this.eventsService.setSubmitFromPreview(false);
    const tagsArr: Array<string> = this.eventInfForm.value.tags;
    const sendEventDto: PagePreviewDTO = {
      title: formVal.title,
      description: formVal.description,
      eventDuration: formVal.duration,
      editorText: formVal.description,
      open: formVal.open,
      dates: [
        {
          date: new Date(),
          finishDate: new Date().toDateString(),
          startDate: new Date().toDateString(),
          check: true,
          valid: true,
          onlineLink: undefined,
          coordinates: {
            latitude: 50,
            longitude: 50
          }
        }
      ],
      tags: tagsArr,
      imgArray: this.imgArray,
      imgArrayToPreview: this.imgArray,
      location: {
        place: 'ff',
        date: new Date()
      }
    };
    this.eventsService.setForm(sendEventDto);
    this.router.navigate(['events', 'preview']);
  }
}
