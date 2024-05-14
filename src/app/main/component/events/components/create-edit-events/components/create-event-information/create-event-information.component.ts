import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ContentChange } from 'ngx-quill';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { quillConfig } from '../../quillEditorFunc';

import { EVENT_LOCALE, EventLocaleKeys } from '../../../../models/event-consts';
import { EventInformation, EventInformationGroup, FormCollectionEmitter, ImagesContainer } from '../../../../models/events.interface';
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
  @Input() formInput: EventInformation;
  isQuillUnfilled = false;
  quillLength = 0;
  quillModules = null;
  imgArray: string[] = [];
  // TODO CHANGE VALUE TO INITIAL
  eventInfForm: FormGroup<EventInformationGroup> = this.fb.nonNullable.group({
    title: ['TitleTest', [Validators.required, Validators.maxLength(70)]],
    duration: [1, Validators.required],
    description: ['helloworld12345678901011', [quillEditorValidator(), Validators.required]],
    editorText: ['<p>helloworld12345678901011</p>'],
    open: [true, Validators.required],
    tags: [['Social'], [Validators.required, Validators.minLength(1)]],
    images: [[] as Array<ImagesContainer>]
  });

  @Output() formStatus: EventEmitter<FormCollectionEmitter<EventInformation>> = new EventEmitter();
  protected readonly EVENT_LOCALE = EVENT_LOCALE;
  private _key = Symbol();

  constructor(
    protected localStorageService: LocalStorageService,
    protected fb: FormBuilder,
    protected eventsService: EventsService,
    protected router: Router,
    private bridge: FormBridgeService
  ) {}

  get images(): ImagesContainer[] {
    return this.eventInfForm.controls.images.value;
  }

  ngOnInit() {
    this.quillModules = quillConfig;
    this.eventInfForm.get('duration').valueChanges.subscribe((value) => {
      this.bridge.days = Array(this.eventInfForm.controls.duration.value);
    });

    this.eventInfForm.statusChanges.subscribe((value) => {
      if (value === 'VALID') {
        this.formStatus.emit({ key: this._key, form: this.eventInfForm.getRawValue(), valid: true });
        console.log(this.eventInfForm.getRawValue());
        this.eventsService.setInformationForm(this.eventInfForm.getRawValue());
      } else {
        this.formStatus.emit({ key: this._key, form: undefined, valid: false });
      }
    });
    if (this.formInput) {
      this.eventInfForm.setValue(this.formInput, { emitEvent: false });
    }
  }

  quillContentChanged(content: ContentChange) {
    this.quillLength = content.text.length - 1;
    this.isQuillUnfilled = this.quillLength < 20;
    console.log(this.eventInfForm.controls.description.value);
    this.eventInfForm.get('description').setValue(content.text.trimEnd());
  }

  getLocale(localeKey: EventLocaleKeys): string {
    return EVENT_LOCALE[localeKey][this.localStorageService.getCurrentLanguage()];
  }

  setImagesUrlArray(value: ImagesContainer[]) {
    this.eventInfForm.controls.images.setValue(value);
  }
}
