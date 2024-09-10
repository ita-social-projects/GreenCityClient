import { Component, Input, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ContentChange } from 'ngx-quill';

import { FormGroup } from '@angular/forms';
import { quillConfig } from '../../quillEditorFunc';

import { EVENT_LOCALE, EventLocaleKeys } from '../../../../models/event-consts';
import { ImagesContainer } from '../../../../models/events.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-event-information',
  templateUrl: './create-event-information.component.html',
  styleUrls: ['./create-event-information.component.scss']
})
export class CreateEventInformationComponent implements OnInit {
  isQuillUnfilled = false;
  quillLength = 0;
  quillModules = quillConfig;
  imgArray: string[] = [];
  @Input() eventInfForm: FormGroup;

  titleLength: string;
  protected readonly EVENT_LOCALE = EVENT_LOCALE;

  constructor(
    protected localStorageService: LocalStorageService,
    protected router: Router
  ) {}

  get images(): ImagesContainer[] {
    return this.eventInfForm.controls.images.value;
  }

  ngOnInit() {
    this.eventInfForm.get('title').valueChanges.subscribe((value) => {
      this.titleLength = value.length + ' / ' + 70;
    });
  }

  quillContentChanged(content: ContentChange) {
    this.quillLength = content.text.length - 1;
    this.isQuillUnfilled = this.quillLength < 20;
    this.eventInfForm.get('description').setValue(content.text.trimEnd());
  }

  getLocale(localeKey: EventLocaleKeys): string {
    return EVENT_LOCALE[localeKey][this.localStorageService.getCurrentLanguage()];
  }

  setImagesUrlArray(value: ImagesContainer[]) {
    this.eventInfForm.controls.images.setValue(value);
  }
}
