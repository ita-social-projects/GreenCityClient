import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil, catchError } from 'rxjs/operators';
import { FileHandle, QueryParams, TextAreasHeight } from '../../models/create-news-interface';
import { EcoNewsService } from '../../services/eco-news.service';
import { Subscription, ReplaySubject, throwError } from 'rxjs';
import { CreateEcoNewsService } from '@eco-news-service/create-eco-news.service';
import { CreateEditNewsFormBuilder } from './create-edit-news-form-builder';
import { FilterModel } from '@shared/components/tag-filter/tag-filter.model';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { ACTION_TOKEN, TEXT_AREAS_HEIGHT } from './action.constants';
import { ActionInterface } from '../../models/action.interface';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { FormBaseComponent } from '@shared/components/form-base/form-base.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import Quill from 'quill';
import 'quill-emoji/dist/quill-emoji.js';
import ImageResize from 'quill-image-resize-module';
import { checkImages, dataURLtoFile, quillConfig } from './quillEditorFunc';
import { ActionsSubject, Store } from '@ngrx/store';
import { CreateEcoNewsAction, EditEcoNewsAction, NewsActions } from 'src/app/store/actions/ecoNews.actions';
import { ofType } from '@ngrx/effects';
import { Patterns } from 'src/assets/patterns/patterns';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { tagsListEcoNewsData } from '@eco-news-models/eco-news-consts';
import { ImageService } from '@global-service/image/image.service';

@Component({
  selector: 'app-create-edit-news',
  templateUrl: './create-edit-news.component.html',
  styleUrls: ['./create-edit-news.component.scss']
})
export class CreateEditNewsComponent extends FormBaseComponent implements OnInit, OnDestroy {
  constructor(
    private actionsSubj: ActionsSubject,
    private store: Store,
    public router: Router,
    public dialog: MatDialog,
    private injector: Injector,
    private langService: LanguageService,
    private fb: FormBuilder,
    private imageService: ImageService,
    @Inject(ACTION_TOKEN) private config: { [name: string]: ActionInterface }
  ) {
    super(router, dialog);
    this.createEditNewsFormBuilder = injector.get(CreateEditNewsFormBuilder);
    this.createEcoNewsService = injector.get(CreateEcoNewsService);
    this.ecoNewsService = injector.get(EcoNewsService);
    this.route = injector.get(ActivatedRoute);
    this.localStorageService = injector.get(LocalStorageService);
    this.snackBar = injector.get(MatSnackBarComponent);
    this.quillModules = quillConfig;
    Quill.register('modules/imageResize', ImageResize);
  }

  isPosting = false;
  form: FormGroup;
  textAreasHeight: TextAreasHeight;
  isLinkOrEmpty = true;
  newsItemSubscription: Subscription;
  date = {
    day: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  };
  author: string = localStorage.getItem('name');
  attributes: ActionInterface;
  filters: FilterModel[] = tagsListEcoNewsData;
  tagMaxLength = 3;
  newsId: number;
  formData: FormGroup;
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  isFormInvalid: boolean;
  formChangeSub: Subscription;
  previousPath: string;
  popupConfig = {
    hasBackdrop: true,
    closeOnNavigation: true,
    disableClose: true,
    panelClass: 'popup-dialog-container',
    data: {
      popupTitle: 'homepage.eco-news.news-popup.title',
      popupSubtitle: 'homepage.eco-news.news-popup.subtitle',
      popupConfirm: 'homepage.eco-news.news-popup.confirm',
      popupCancel: 'homepage.eco-news.news-popup.cancel'
    }
  };
  onSubmit;
  private createEditNewsFormBuilder: CreateEditNewsFormBuilder;
  private createEcoNewsService: CreateEcoNewsService;
  private ecoNewsService: EcoNewsService;
  private route: ActivatedRoute;
  private localStorageService: LocalStorageService;
  private snackBar: MatSnackBarComponent;
  quillModules = {};
  blurred = false;
  focused = false;
  editorText = '';
  editorHTML = '';
  savingImages = false;
  updatedEcoNewsTags: Array<string>;
  currentLang: string;
  imageFile: FileHandle;
  // TODO: add types | DTO to service

  ngOnInit() {
    this.previousPath = this.localStorageService.getPreviousPage() || '/news';
    this.getNewsIdFromQueryParams();
    this.initPageForCreateOrEdit();
    this.onSourceChange();
    this.currentLang = this.localStorageService.getCurrentLanguage();
    this.localStorageService.languageSubject.pipe(takeUntil(this.destroyed$)).subscribe((lang: string) => {
      this.currentLang = lang;
    });
    this.imageFile = this.createEcoNewsService.file;
  }

  getFile(image: FileHandle): void {
    this.createEcoNewsService.file = image;
  }

  setInitialValues(): void {
    if (!this.createEcoNewsService.isBackToEditing) {
      this.initialValues = this.getFormValues();
    }
    this.isFormInvalid = !this.newsId;
    this.onValueChanges();
  }

  allowUserEscape(): void {
    this.areChangesSaved = true;
  }

  getFormValues(): any {
    return this.form.value;
  }

  getControl(control: string) {
    return this.form.get(control);
  }

  onValueChanges(): void {
    this.formChangeSub = this.form.valueChanges.subscribe(() => {
      this.isFormInvalid = !this.form.valid || !this.tags().length || !this.isLinkOrEmpty || this.isImageValid();
    });
  }

  initPageForCreateOrEdit(): void {
    this.textAreasHeight = TEXT_AREAS_HEIGHT;

    if (this.createEcoNewsService.isBackToEditing) {
      if (this.createEcoNewsService.getNewsId()) {
        this.setDataForEdit();
      } else {
        this.setDataForCreate();
      }
      this.formData = this.createEcoNewsService.getFormData();
      this.newsId = this.createEcoNewsService.getNewsId();
      if (this.formData) {
        this.form = this.createEditNewsFormBuilder.getEditForm(this.formData.value);
      }
      this.setInitialValues();
    } else {
      if (this.newsId) {
        this.fetchNewsItemToEdit();
        this.setDataForEdit();
      } else {
        this.form = this.createEditNewsFormBuilder.getSetupForm();
        this.setDataForCreate();
        this.setInitialValues();
      }
    }
  }

  setDataForEdit(): void {
    this.attributes = this.config.edit;
    this.onSubmit = this.editNews;
  }

  setDataForCreate(): void {
    this.attributes = this.config.create;
    this.onSubmit = this.createNews;
  }

  getNewsIdFromQueryParams(): void {
    this.route.queryParams.subscribe((queryParams: QueryParams) => {
      this.newsId = queryParams.id;
    });
  }

  autoResize(textarea: boolean, e: any) {
    const DEFAULT_SIZE_INPUT_TITTLE = '48px';
    const DEFAULT_SIZE_INPUT_CONTENT = '131px';
    e.target.style.height = textarea ? DEFAULT_SIZE_INPUT_CONTENT : DEFAULT_SIZE_INPUT_TITTLE;
    e.target.style.height = e.target.scrollHeight + 'px';
  }

  onSourceChange(): void {
    if (this.form) {
      this.form.get('source').valueChanges.subscribe((source: string) => {
        this.isLinkOrEmpty = Patterns.linkPattern.test(source);
      });
    }
  }

  sendData(text: string): void {
    this.form.value.content = text;

    this.isPosting = true;
    this.store.dispatch(CreateEcoNewsAction({ value: this.form.value }));

    this.actionsSubj
      .pipe(
        ofType(NewsActions.CreateEcoNewsSuccess),
        takeUntil(this.destroyed$),
        catchError((error: Error) => {
          this.snackBar.openSnackBar('error', error.message);
          return throwError(() => new Error('An error occurred while sending images.'));
        })
      )
      .subscribe(() => {
        this.snackBar.openSnackBar('createEvent');
        this.escapeFromCreatePage();
      });
  }

  createNews(): void {
    const imagesSrc = checkImages(this.editorHTML);
    if (imagesSrc) {
      const imgFiles = imagesSrc.map((base64) => dataURLtoFile(base64));
      this.createEcoNewsService.sendImagesData(imgFiles).subscribe({
        next: (response) => {
          response.forEach((link) => (this.editorHTML = this.editorHTML.replace(Patterns.Base64Regex, link)));
          this.sendData(this.editorHTML);
        },
        error: (err) => console.error(err)
      });
    } else {
      this.sendData(this.editorHTML);
    }
  }

  escapeFromCreatePage(): void {
    this.isPosting = false;
    this.allowUserEscape();
    this.router.navigate([this.previousPath]).catch((err) => console.error(err));
  }

  editData(text: string): void {
    const dataToEdit = {
      ...this.form?.value,
      id: this.newsId
    };
    dataToEdit.content = text;
    this.isPosting = true;

    this.store.dispatch(EditEcoNewsAction({ form: dataToEdit }));

    this.actionsSubj
      .pipe(
        ofType(NewsActions.EditEcoNewsSuccess),
        catchError((error) => {
          this.snackBar.openSnackBar('error', 'Something went wrong. Please reload page or try again later.');
          return throwError(() => new Error('An error occurred while sending images.'));
        })
      )
      .subscribe(() => this.escapeFromCreatePage());
  }

  editNews(): void {
    if (!this.editorHTML) {
      this.editorHTML = this.form?.value?.content;
    }
    const imagesSrc = checkImages(this.editorHTML);

    if (imagesSrc) {
      const imgFiles = imagesSrc.map((base64) => dataURLtoFile(base64));
      this.createEcoNewsService.sendImagesData(imgFiles).subscribe({
        next: (response) => {
          response.forEach((link) => (this.editorHTML = this.editorHTML.replace(Patterns.Base64Regex, link)));
          this.editData(this.editorHTML);
        },
        error: (err) => console.error(err)
      });
    } else {
      this.editData(this.editorHTML);
    }
  }

  fetchNewsItemToEdit(): void {
    this.newsItemSubscription = this.ecoNewsService
      .getEcoNewsById(this.newsId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((item: EcoNewsModel) => {
        this.form = this.createEditNewsFormBuilder.getEditForm(item);
        this.setActiveFilters(item);
        this.onSourceChange();
        this.setInitialValues();
        if (item.imagePath) {
          this.imageService.createFileHandle(item.imagePath, 'image/jpeg').subscribe((fileHandle: FileHandle) => {
            this.createEcoNewsService.file = fileHandle;
            this.imageFile = fileHandle;
          });
        } else {
          console.error('ImagePath is null or undefined');
        }
      });
  }

  setActiveFilters(itemToUpdate: EcoNewsModel): void {
    if (!itemToUpdate.tags.length) {
      return;
    }

    this.filters = this.filters.map((tag) => ({ ...tag, isActive: itemToUpdate.tags.includes(tag.name) }));
  }

  tags(): FormArray {
    return this.form.controls.tags as FormArray;
  }

  getTagsList(list: FilterModel[]): void {
    const selectedTagsList = list.map((el) => this.langService.getLangValue(el.nameUa, el.name));
    this.form.setControl('tags', this.fb.array(selectedTagsList));
    this.createEcoNewsService.setTags(list);
  }

  goToPreview(): void {
    this.allowUserEscape();
    this.createEcoNewsService.setForm(this.form);
    this.createEcoNewsService.setNewsId(this.newsId);
    this.router.navigate(['news', 'preview']).catch((err) => console.error(err));
  }

  isImageValid(): boolean {
    return this.createEcoNewsService.isImageValid;
  }

  changedEditor(event: EditorChangeContent | EditorChangeSelection): void {
    if (event.event !== 'selection-change') {
      this.editorText = event.text;
      this.editorHTML = event.html;
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    if (this.formChangeSub) {
      this.formChangeSub.unsubscribe();
    }
  }
}
