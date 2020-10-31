import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil, catchError } from 'rxjs/operators';
import { QueryParams, TextAreasHeight } from './../../models/create-news-interface';
import { EcoNewsService } from './../../services/eco-news.service';
import { Subscription, ReplaySubject, throwError } from 'rxjs';
import { CreateEcoNewsService } from '@eco-news-service/create-eco-news.service';
import { CreateEditNewsFormBuilder } from './create-edit-news-form-builder';
import { FilterModel } from '@eco-news-models/create-news-interface';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { CancelPopUpComponent } from '@shared/components';
import { ACTION_TOKEN, TEXT_AREAS_HEIGHT, FILTERS } from './action.constants';
import { ActionInterface } from '../../models/action.interface';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

@Component({
  selector: 'app-create-edit-news',
  templateUrl: './create-edit-news.component.html',
  styleUrls: ['./create-edit-news.component.scss']
})
export class CreateEditNewsComponent implements OnInit, OnDestroy {
  public isPosting = false;
  public form: FormGroup;
  public isArrayEmpty = true;
  public textAreasHeight: TextAreasHeight;
  public isLinkOrEmpty = true;
  public newsItemSubscription: Subscription;
  public isFilterValidation = false;
  public year: number = new Date().getFullYear();
  public day: number = new Date().getDate();
  public month: number = new Date().getMonth();
  public author: string = localStorage.getItem('name');
  public attributes: ActionInterface;
  public filters: Array<FilterModel>;
  public newsId: string;
  public formData: FormGroup;
  private destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  public onSubmit(): void {}


  constructor(private router: Router,
              private createEditNewsFormBuilder: CreateEditNewsFormBuilder,
              private createEcoNewsService: CreateEcoNewsService,
              private ecoNewsService: EcoNewsService,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              @Inject(ACTION_TOKEN) private config: { [name: string]: ActionInterface },
              private snackBar: MatSnackBarComponent) { }

  ngOnInit() {
    this.getNewsIdFromQueryParams();
    this.initPageforCreateOrEdit();
    this.onSourceChange();
  }

  public initPageforCreateOrEdit(): void {
    this.textAreasHeight = TEXT_AREAS_HEIGHT;
    this.filters = FILTERS;
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
        this.setActiveFilters(this.formData.value);
      }
    } else {
      if (this.newsId) {
        this.fetchNewsItemToEdit();
        this.setDataForEdit();
      } else {
        this.form = this.createEditNewsFormBuilder.getSetupForm();
        this.setDataForCreate();
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

  public autoResize(event): void {
    const checkTextAreaHeight = event.target.scrollHeight > this.textAreasHeight.minTextAreaScrollHeight
      && event.target.scrollHeight < this.textAreasHeight.maxTextAreaScrollHeight;
    const maxHeight = checkTextAreaHeight ? this.textAreasHeight.maxTextAreaHeight
      : event.target.scrollHeight < this.textAreasHeight.minTextAreaScrollHeight;
    const minHeight = checkTextAreaHeight ? this.textAreasHeight.minTextAreaHeight : `${event.target.scrollHeight}px`;
    event.target.style.height = checkTextAreaHeight ? maxHeight : minHeight;
  }

  public onSourceChange(): void {
    if (this.form) {
      this.form.get('source').valueChanges.subscribe((source: string) => {
        this.isLinkOrEmpty = /^$|^https?:\/\//.test(source);
      });
    }
  }


  public createNews(): void {
    this.isPosting = true;
    this.createEcoNewsService
      .sendFormData(this.form)
            .pipe(
        catchError((error) => {
          this.snackBar.openSnackBar('Oops, something went wrong. Please reload page or try again later.', 'X', 'red-snackbar');

          return throwError(error);
        })
      )
      .subscribe(
        () => {
          this.isPosting = false;
          this.router.navigate(['/news']);
        }
      );
  }

  public editNews(): void {
    const dataToEdit = {
      ...this.form.value,
      id: this.newsId
    };

    this.createEcoNewsService.editNews(dataToEdit)
      .pipe(
        catchError((error) => {
          this.snackBar.openSnackBar('Oops, something went wrong. Please reload page or try again later.', 'X', 'red-snackbar');

          return throwError(error);
        })
      )
      .subscribe(
        () => {
          this.isPosting = false;
          this.router.navigate(['/news']);
        }
      );
  }

  public fetchNewsItemToEdit(): void {
    this.newsItemSubscription = this.ecoNewsService
      .getEcoNewsById(this.newsId)
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe((item: EcoNewsModel) => {
        this.form = this.createEditNewsFormBuilder.getEditForm(item);
        this.setActiveFilters(item);
        this.onSourceChange();
      });
  }

  public setActiveFilters(itemToUpdate: EcoNewsModel): void {
    if (itemToUpdate.tags.length) {
      this.isArrayEmpty = false;

      itemToUpdate.tags.forEach((tag: string) => {

        const index = this.filters.findIndex((filterObj: FilterModel) => filterObj.name === tag);

        this.filters = [
          ...this.filters.slice(0, index),
          { name: tag, isActive: true },
          ...this.filters.slice(index + 1)
        ];

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
    const index = tagsArray.findIndex(tag => tag === filterObj.name);
    this.tags().removeAt(index);

    this.toggleIsActive(filterObj, false);

  }

  public filtersValidation(filterObj: FilterModel): void {
    if (this.form.value.tags.length > 3) {
      this.isFilterValidation = true;
      setTimeout(() => this.isFilterValidation = false, 3000);
      this.tags().removeAt(3);
      this.toggleIsActive(filterObj, false);
    }
  }

  public toggleIsActive(filterObj: FilterModel, newValue: boolean): void {
    const index = this.filters.findIndex((item: FilterModel) => item.name === filterObj.name);

    this.filters = [
      ...this.filters.slice(0, index),
      { name: filterObj.name, isActive: newValue },
      ...this.filters.slice(index + 1)
    ];
  }

  public goToPreview(): void {
    this.createEcoNewsService.setForm(this.form);
    this.createEcoNewsService.setNewsId(this.newsId);
    this.router.navigate(['news', 'preview']);
  }

  public openCancelPopup(): void {
    this.dialog.open(CancelPopUpComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: {
        currentPage: 'eco news'
      }
    });
  }

  ngOnDestroy() {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
