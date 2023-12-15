import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { takeUntil, catchError, take } from 'rxjs/operators';
import { QueryParams, TextAreasHeight } from '../../models/create-news-interface';
import { EcoNewsService } from '../../services/eco-news.service';
import { Subscription, ReplaySubject, throwError } from 'rxjs';
import { CreateEcoNewsService } from '@eco-news-service/create-eco-news.service';
import { CreateEditNewsFormBuilder } from './create-edit-news-form-builder';
import { FilterModel } from '@shared/components/tag-filter/tag-filter.model';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { TagInterface } from '@shared/components/tag-filter/tag-filter.model';
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
    private fb: UntypedFormBuilder,
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

  public isPosting = false;
  public form: UntypedFormGroup;
  public textAreasHeight: TextAreasHeight;
  public isLinkOrEmpty = true;
  public newsItemSubscription: Subscription;
  public date = {
    day: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  };
  public author: string = localStorage.getItem('name');
  public attributes: ActionInterface;
  public filters: FilterModel[] = [];
  public tagMaxLength = 3;
  public newsId: number;
  public formData: UntypedFormGroup;
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  public isFormInvalid: boolean;
  public formChangeSub: Subscription;
  public previousPath = '/news';
  public popupConfig = {
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
  public onSubmit;
  private createEditNewsFormBuilder: CreateEditNewsFormBuilder;
  private createEcoNewsService: CreateEcoNewsService;
  private ecoNewsService: EcoNewsService;
  private route: ActivatedRoute;
  private localStorageService: LocalStorageService;
  private snackBar: MatSnackBarComponent;
  public quillModules = {};
  public blurred = false;
  public focused = false;
  public editorText = '';
  public editorHTML = '';
  public savingImages = false;
  public backRoute: string;
  public updatedEcoNewsTags: Array<string>;
  public currentLang: string;

  // TODO: add types | DTO to service

  ngOnInit() {
    this.backRoute = this.localStorageService.getPreviousPage();
    this.getNewsIdFromQueryParams();
    this.initPageForCreateOrEdit();
    this.onSourceChange();
    this.currentLang = this.localStorageService.getCurrentLanguage();
    this.localStorageService.languageSubject.pipe(takeUntil(this.destroyed$)).subscribe((lang: string) => {
      this.currentLang = lang;
    });
    this.getAllTags();
  }

  public setInitialValues(): void {
    if (!this.createEcoNewsService.isBackToEditing) {
      this.initialValues = this.getFormValues();
    }
    this.isFormInvalid = !!!this.newsId;
    this.onValueChanges();
  }

  public allowUserEscape(): void {
    this.areChangesSaved = true;
  }

  public getFormValues(): any {
    return this.form.value;
  }

  public getControl(control: string) {
    return this.form.get(control);
  }

  public onValueChanges(): void {
    this.formChangeSub = this.form.valueChanges.subscribe(() => {
      this.isFormInvalid = !this.form.valid || !this.tags().length || !this.isLinkOrEmpty || this.isImageValid();
    });
  }

  private getAllTags() {
    this.ecoNewsService
      .getAllPresentTags()
      .pipe(take(1))
      .subscribe((tagsArray: Array<TagInterface>) => {
        this.filters = tagsArray.map((tag) => {
          return {
            name: tag.name,
            nameUa: tag.nameUa,
            isActive: false
          };
        });
      });
  }

  public initPageForCreateOrEdit(): void {
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

  public setDataForEdit(): void {
    this.attributes = this.config.edit;
    this.onSubmit = this.editNews;
  }

  public setDataForCreate(): void {
    this.attributes = this.config.create;
    this.onSubmit = this.createNews;
  }

  public getNewsIdFromQueryParams(): void {
    this.route.queryParams.subscribe((queryParams: QueryParams) => {
      this.newsId = queryParams.id;
    });
  }

  public autoResize(textarea: boolean, e: any) {
    const DEFAULT_SIZE_INPUT_TITTLE = '48px';
    const DEFAULT_SIZE_INPUT_CONTENT = '131px';
    e.target.style.height = textarea ? DEFAULT_SIZE_INPUT_CONTENT : DEFAULT_SIZE_INPUT_TITTLE;
    e.target.style.height = e.target.scrollHeight + 'px';
  }

  public onSourceChange(): void {
    if (this.form) {
      this.form.get('source').valueChanges.subscribe((source: string) => {
        this.isLinkOrEmpty = Patterns.linkPattern.test(source);
      });
    }
  }

  public sendData(text: string): void {
    this.form.value.content = text;

    this.isPosting = true;
    this.store.dispatch(CreateEcoNewsAction({ value: this.form.value }));

    this.actionsSubj
      .pipe(
        ofType(NewsActions.CreateEcoNewsSuccess),
        takeUntil(this.destroyed$),
        catchError((err) => {
          this.snackBar.openSnackBar('Oops, something went wrong. Please reload page or try again later.');
          return throwError(err);
        })
      )
      .subscribe(() => this.escapeFromCreatePage());
  }

  public createNews(): void {
    const imagesSrc = checkImages(this.editorHTML);

    if (imagesSrc) {
      const imgFiles = imagesSrc.map((base64) => dataURLtoFile(base64));

      this.createEcoNewsService.sendImagesData(imgFiles).subscribe(
        (response) => {
          const findBase64Regex = Patterns.Base64Regex;
          response.forEach((link) => {
            this.editorHTML = this.editorHTML.replace(findBase64Regex, link);
          });
          this.sendData(this.editorHTML);
        },
        (err) => console.error(err)
      );
    } else {
      this.sendData(this.editorHTML);
    }
  }

  public escapeFromCreatePage(): void {
    this.isPosting = false;
    this.allowUserEscape();
    this.router.navigate([this.backRoute]).catch((err) => console.error(err));
  }

  public editData(text: string): void {
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
          this.snackBar.openSnackBar('Something went wrong. Please reload page or try again later.');
          return throwError(error);
        })
      )
      .subscribe(() => this.escapeFromCreatePage());
  }

  public editNews(): void {
    if (!this.editorHTML) {
      this.editorHTML = this.form?.value?.content;
    }
    const imagesSrc = checkImages(this.editorHTML);

    if (imagesSrc) {
      const imgFiles = imagesSrc.map((base64) => dataURLtoFile(base64));

      this.createEcoNewsService.sendImagesData(imgFiles).subscribe(
        (response) => {
          const findBase64Regex = Patterns.Base64Regex;
          response.forEach((link) => {
            this.editorHTML = this.editorHTML.replace(findBase64Regex, link);
          });
          this.editData(this.editorHTML);
        },
        (err) => console.error(err)
      );
    } else {
      this.editData(this.editorHTML);
    }
  }

  public fetchNewsItemToEdit(): void {
    this.newsItemSubscription = this.ecoNewsService
      .getEcoNewsById(this.newsId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((item: EcoNewsModel) => {
        this.form = this.createEditNewsFormBuilder.getEditForm(item);
        this.setActiveFilters(item);
        this.onSourceChange();
        this.setInitialValues();
      });
  }

  public setActiveFilters(itemToUpdate: EcoNewsModel): void {
    if (itemToUpdate.tags.length && itemToUpdate.tagsUa.length) {
      this.filters.forEach((filter) => {
        itemToUpdate.tagsUa.forEach((tag, index) => {
          if (filter.nameUa === tag || filter.name === tag) {
            this.filters[index] = { ...filter, isActive: true };
          }
        });
      });
    }
  }

  tags(): UntypedFormArray {
    return this.form.controls.tags as UntypedFormArray;
  }

  getTagsList(list: FilterModel[]): void {
    const selectedTagsList = list.map((el) => this.langService.getLangValue(el.nameUa, el.name) as string);
    this.form.setControl('tags', this.fb.array(selectedTagsList));
    this.createEcoNewsService.setTags(list);
  }

  public goToPreview(): void {
    this.allowUserEscape();
    this.createEcoNewsService.fileUrl = this.form.value.image;
    this.createEcoNewsService.setForm(this.form);
    this.createEcoNewsService.setNewsId(this.newsId);
    this.router.navigate(['news', 'preview']).catch((err) => console.error(err));
  }

  public isImageValid(): boolean {
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
