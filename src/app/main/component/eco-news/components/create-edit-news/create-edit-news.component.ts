import { Component, OnInit, OnDestroy, Inject, Injector } from '@angular/core';
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil, catchError, take, delay, concatMap } from 'rxjs/operators';
import { QueryParams, TextAreasHeight } from '../../models/create-news-interface';
import { EcoNewsService } from '../../services/eco-news.service';
import { Subscription, ReplaySubject, throwError, Observable } from 'rxjs';
import { CreateEcoNewsService } from '@eco-news-service/create-eco-news.service';
import { CreateEditNewsFormBuilder } from './create-edit-news-form-builder';
import { FilterModel } from '@eco-news-models/create-news-interface';
import { EcoNewsModel, NewsTagInterface } from '@eco-news-models/eco-news-model';
import { ACTION_TOKEN, TEXT_AREAS_HEIGHT } from './action.constants';
import { ActionInterface } from '../../models/action.interface';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { FormBaseComponent } from '@shared/components/form-base/form-base.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import Quill from 'quill';
import 'quill-emoji/dist/quill-emoji.js';
import ImageResize from 'quill-image-resize-module';
import { checkImages, dataURLtoFile } from './quillEditorFunc';

@Component({
  selector: 'app-create-edit-news',
  templateUrl: './create-edit-news.component.html',
  styleUrls: ['./create-edit-news.component.scss']
})
export class CreateEditNewsComponent extends FormBaseComponent implements OnInit, OnDestroy {
  constructor(
    public router: Router,
    public dialog: MatDialog,
    private injector: Injector,
    @Inject(ACTION_TOKEN) private config: { [name: string]: ActionInterface }
  ) {
    super(router, dialog);
    this.createEditNewsFormBuilder = injector.get(CreateEditNewsFormBuilder);
    this.createEcoNewsService = injector.get(CreateEcoNewsService);
    this.ecoNewsService = injector.get(EcoNewsService);
    this.route = injector.get(ActivatedRoute);
    this.localStorageService = injector.get(LocalStorageService);
    this.snackBar = injector.get(MatSnackBarComponent);
    this.quillModules = {
      'emoji-shortname': true,
      'emoji-textarea': false,
      'emoji-toolbar': true,
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote', 'code-block'],

          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          [{ direction: 'rtl' }], // text direction

          [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ font: [] }],
          [{ align: [] }],
          ['clean'], // remove formatting button
          ['link', 'image', 'video'], // link and image, video
          ['emoji']
        ]
        // handlers: {
        //   image: (image) => {
        //     console.log(image);
        //   }
        // },
      },
      imageResize: true
    };
    Quill.register('modules/imageResize', ImageResize);
  }

  public isPosting = false;
  public form: FormGroup;
  public isArrayEmpty = true;
  public textAreasHeight: TextAreasHeight;
  public isLinkOrEmpty = true;
  public newsItemSubscription: Subscription;
  public isFilterValidation = false;
  public date = {
    day: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  };
  public author: string = localStorage.getItem('name');
  public attributes: ActionInterface;
  public filters: FilterModel[] = [];
  public newsId: string;
  public formData: FormGroup;
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

  ngOnInit() {
    this.getNewsIdFromQueryParams();
    this.initPageForCreateOrEdit();
    this.onSourceChange();
    this.setLocalizedTags();
  }

  private filterArr(item: FilterModel, index: number) {
    return [...this.filters.slice(0, index), item, ...this.filters.slice(index + 1)];
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

  public onValueChanges(): void {
    console.log(this.form);
    this.formChangeSub = this.form.valueChanges.subscribe(() => {
      this.isFormInvalid = !this.form.valid || this.isArrayEmpty || !this.isLinkOrEmpty || this.isImageValid();
    });
  }

  private setLocalizedTags() {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroyed$)).subscribe(() => this.getAllTags());
  }

  private getAllTags() {
    const tags = this.localStorageService.getTagsOfNews('newsTags');
    if (tags) {
      this.filters = tags;
      return;
    }

    this.ecoNewsService
      .getAllPresentTags()
      .pipe(take(1))
      .subscribe((tagsArray: Array<NewsTagInterface>) => {
        this.filters = tagsArray.map((tag) => {
          return {
            name: tag.name,
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
        console.log('1');
        this.form = this.createEditNewsFormBuilder.getEditForm(this.formData.value);
        this.setActiveFilters(this.formData.value);
      }
      this.setInitialValues();
    } else {
      if (this.newsId) {
        console.log('2');
        this.fetchNewsItemToEdit();
        this.setDataForEdit();
      } else {
        console.log('3');
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
        this.isLinkOrEmpty = /^$|^https?:\/\//.test(source);
      });
    }
  }

  public sendData(text: string): void {
    this.form.value.content = text;
    this.createEcoNewsService
      .sendFormData(this.form)
      .pipe(
        takeUntil(this.destroyed$),
        catchError((err) => {
          this.snackBar.openSnackBar('Oops, something went wrong. Please reload page or try again later.');
          return throwError(err);
        })
      )
      .subscribe(() => this.escapeFromCreatePage());

    this.localStorageService.removeTagsOfNews('newsTags');
  }

  public createNews(): void {
    const imagesSrc = checkImages(this.editorHTML);

    if (imagesSrc) {
      const imgFiles = imagesSrc.map((base64) => dataURLtoFile(base64));

      this.createEcoNewsService.sendImagesData(imgFiles).subscribe(
        (response) => {
          const findBase64Regex = /data:image\/([a-zA-Z]*);base64,([^"]*)/g;
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
    this.router.navigate(['/news']).catch((err) => console.error(err));
  }

  public editData(text: string): void {
    const dataToEdit = {
      ...this.form?.value,
      id: this.newsId
    };
    dataToEdit.content = text;

    this.createEcoNewsService
      .editNews(dataToEdit)
      .pipe(
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
          const findBase64Regex = /data:image\/([a-zA-Z]*);base64,([^"]*)/g;
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
    if (itemToUpdate.tags.length) {
      this.isArrayEmpty = false;
      itemToUpdate.tags.forEach((tag: NewsTagInterface) => {
        const index = this.filters.findIndex((filterObj: FilterModel) => filterObj.name === `${tag}`);
        this.filters = this.filterArr({ name: `${tag}`, isActive: true }, index);
      });
    }
  }

  tags(): FormArray {
    return this.form.controls.tags as FormArray;
  }

  public addFilters(filterObj: FilterModel): void {
    if (!filterObj.isActive) {
      this.toggleIsActive(filterObj, true);
      this.isArrayEmpty = false;
      this.tags().push(new FormControl(filterObj.name));
      this.filtersValidation(filterObj);
    } else {
      this.removeFilters(filterObj);
    }
  }

  public removeFilters(filterObj: FilterModel): void {
    const tagsArray = this.form.value.tags;
    if (filterObj.isActive && tagsArray.length === 1) {
      this.isArrayEmpty = true;
    }
    const index = tagsArray.findIndex((tag) => tag === filterObj.name);
    this.tags().removeAt(index);
    this.toggleIsActive(filterObj, false);
  }

  public filtersValidation(filterObj: FilterModel): void {
    if (this.form.value.tags.length > 3) {
      this.isFilterValidation = true;
      setTimeout(() => (this.isFilterValidation = false), 3000);
      this.tags().removeAt(3);
      this.toggleIsActive(filterObj, false);
    }
  }

  public toggleIsActive(filterObj: FilterModel, newValue: boolean): void {
    const index = this.filters.findIndex((item: FilterModel) => item.name === filterObj.name);
    const changedTags = this.filterArr({ name: filterObj.name, isActive: newValue }, index);
    this.filters = changedTags;
    this.localStorageService.setTagsOfNews('newsTags', changedTags);
  }

  public goToPreview(): void {
    this.allowUserEscape();
    this.createEcoNewsService.setForm(this.form);
    this.createEcoNewsService.setNewsId(this.newsId);
    this.router.navigate(['news', 'preview']).catch((err) => console.error(err));
  }

  public isImageValid(): boolean {
    return this.createEcoNewsService.isImageValid;
  }

  changedEditor(event: EditorChangeContent | EditorChangeSelection) {
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
