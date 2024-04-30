import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ContentChange } from 'ngx-quill';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { quillConfig } from '../../quillEditorFunc';

import { EVENT_LOCALE, EventLocaleKeys } from '../../../../models/event-consts';
import { EventInformation, EventInformationForm } from '../../../../models/events.interface';
import { EventsService } from '../../../../services/events.service';
import { Router } from '@angular/router';
import { quillEditorValidator } from '../../validators/quillEditorValidator';
import { FormBridgeService } from '../../../../services/form-bridge.service';

@Component({
  selector: 'app-create-event-information',
  templateUrl: './create-event-information.component.html',
  styleUrls: ['./create-event-information.component.scss']
})
export class CreateEventInformationComponent implements OnInit {
  isQuillUnfilled = false;
  quillLength = 0;
  quillModules = null;
  imgArray: string[] = [];
  // TODO CHANGE VALUE TO INITIAL
  eventInfForm: FormGroup<EventInformationForm> = this.fb.nonNullable.group({
    title: ['TitleTest', [Validators.required, Validators.maxLength(70)]],
    duration: [1, Validators.required],
    description: ['helloworld12345678901011', [quillEditorValidator(), Validators.required]],
    editorText: ['<p>helloworld12345678901011</p>'],
    open: [true, Validators.required],
    tags: [['Social'], [Validators.required, Validators.minLength(1)]],
    imagesUrl: [[] as Array<string>],
    imagesFile: [[] as Array<File>]
  });

  @Output() formStatus = new EventEmitter<{ status: boolean; form: EventInformation | undefined }>();
  protected readonly EVENT_LOCALE = EVENT_LOCALE;

  constructor(
    protected localStorageService: LocalStorageService,
    protected fb: FormBuilder,
    protected eventsService: EventsService,
    protected router: Router,
    private bridge: FormBridgeService
  ) {}

  get imagesUrl() {
    return this.eventInfForm.controls.imagesUrl;
  }

  ngOnInit() {
    this.quillModules = quillConfig;
    this.eventInfForm.get('duration').valueChanges.subscribe((value) => {
      this.bridge.days = Array(this.eventInfForm.controls.duration.value);
    });

    this.eventInfForm.statusChanges.subscribe((value) => {
      if (value === 'VALID') {
        this.formStatus.emit({ status: true, form: this.eventInfForm.getRawValue() });
        console.log(this.eventInfForm.getRawValue());
        this.eventsService.setInformationForm(this.eventInfForm.getRawValue());
      } else {
        this.formStatus.emit({ status: false, form: undefined });
      }
    });
    const form = this.eventsService.getInformationForm();
    if (form) {
      this.eventInfForm.setValue(form);
      console.log(form);
    }
  }

  quillContentChanged(content: ContentChange) {
    this.quillLength = content.text.length - 1;
    console.log(this.eventInfForm.controls.description.value);
    this.eventInfForm.get('description').setValue(content.text.trimEnd());
  }

  quillValidate() {
    this.isQuillUnfilled = this.quillLength < 20;
  }

  getLocale(localeKey: EventLocaleKeys): string {
    return EVENT_LOCALE[localeKey][this.localStorageService.getCurrentLanguage()];
  }

  setImagesUrlArray(value: string[]) {
    this.eventInfForm.controls.imagesUrl.setValue(value);
  }
}
