import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ContentChange } from 'ngx-quill';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { quillConfig } from '../../quillEditorFunc';
import { EVENT_LOCALE, EventLocaleKeys } from '../../../../models/event-consts';
import { EventInformation, EventInformationGroup, FormCollectionEmitter, ImagesContainer } from '../../../../models/events.interface';
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
  quillModules = quillConfig;
  minLength = 20;
  maxLength = 63206;
  eventInfForm: FormGroup<EventInformationGroup> = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(70)]],
    duration: [1, Validators.required],
    description: ['', [quillEditorValidator(), Validators.required]],
    editorText: [''],
    open: [true, Validators.required],
    tags: [['Social'], [Validators.required, Validators.minLength(1)]],
    images: [[] as Array<ImagesContainer>]
  });

  @Output() formStatus: EventEmitter<FormCollectionEmitter<EventInformation>> = new EventEmitter();
  titleLength: string;
  protected readonly EVENT_LOCALE = EVENT_LOCALE;
  private _key = Symbol();

  constructor(
    protected localStorageService: LocalStorageService,
    protected fb: FormBuilder,
    protected router: Router,
    private bridge: FormBridgeService
  ) {}

  get images(): ImagesContainer[] {
    return this.eventInfForm.controls.images.value;
  }

  ngOnInit() {
    this.quillModules = quillConfig;
    this.eventInfForm.get('duration').valueChanges.subscribe((value) => {
      this.bridge.days = Array(value);
    });
    this.eventInfForm.get('title').valueChanges.subscribe((value) => {
      this.titleLength = value.length + ' / ' + 70;
    });
    this.eventInfForm.statusChanges.subscribe((value) => {
      if (value === 'VALID') {
        this.formStatus.emit({ key: this._key, form: this.eventInfForm.getRawValue(), valid: true });
      } else {
        this.formStatus.emit({ key: this._key, form: undefined, valid: false });
      }
    });

    if (this.formInput) {
      this.eventInfForm.setValue(this.formInput);
    }
  }

  quillContentChanged(content: ContentChange): void {
    this.quillLength = content.text.length - 1;
    this.isQuillUnfilled = this.quillLength < 20;
    this.eventInfForm.get('description').setValue(content.text.trimEnd());
  }

  get quillLabel(): string {
    const typedCharacters = this.quillLength;
    if (typedCharacters < 1) {
      return `${this.getLocale('quillDefault')}`;
    }
    if (typedCharacters > this.maxLength) {
      return `${this.getLocale('quillMaxExceeded')} ${typedCharacters - this.maxLength}`;
    }
    if (typedCharacters < this.minLength) {
      return `${this.getLocale('quillError')} ${this.minLength - typedCharacters}`;
    }
    return `${this.getLocale('quillValid')} ${typedCharacters}`;
  }

  getLocale(localeKey: EventLocaleKeys): string {
    return EVENT_LOCALE[localeKey][this.localStorageService.getCurrentLanguage()];
  }

  setImagesUrlArray(value: ImagesContainer[]): void {
    this.eventInfForm.controls.images.setValue(value);
  }
}
