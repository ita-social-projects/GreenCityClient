import { QueryParams } from './../../models/create-news-interface';
import { EcoNewsService } from './../../services/eco-news.service';
import { Subscription, Subject, ReplaySubject } from 'rxjs';
import { CreateEcoNewsService } from '@eco-news-service/create-eco-news.service';
import { CreateEditNewsFormBuilder } from './create-edit-news-form-builder';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FilterModel } from '@eco-news-models/create-news-interface';
import { ActivatedRoute, Router } from '@angular/router';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { MatDialog } from '@angular/material/dialog';
import { CancelPopUpComponent } from '@shared/components';
import { ACTION_TOKEN } from './action.constants';
import { ActionInterface } from './action.interface';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-create-edit-news',
  templateUrl: './create-edit-news.component.html',
  styleUrls: ['./create-edit-news.component.scss']
})
export class CreateEditNewsComponent implements OnInit, OnDestroy {
  public isPosting = false;
  public newsData;
  public form: FormGroup;
  public isArrayEmpty = true;
  public textAreasHeight = {
    minTextAreaScrollHeight: 50,
    maxTextAreaScrollHeight: 128,
    minTextAreaHeight: '48px',
    maxTextAreaHeight: '128px',
  };
  public isLinkOrEmpty = true;
  public newsItemSubscription: Subscription;
  public isFilterValidation = false;
  public year: number = new Date().getFullYear();
  public day: number = new Date().getDate();
  public month: number = new Date().getMonth();
  public author: string = localStorage.getItem('name');
  public attributes: ActionInterface;

  public filters: Array<FilterModel> = [
    { name: 'News', isActive: false },
    { name: 'Events', isActive: false },
    { name: 'Education', isActive: false },
    { name: 'Initiatives', isActive: false },
    { name: 'Ads', isActive: false }
  ];
  public newsId;
  private destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  public formData;

  constructor(private router: Router,
              private createEditNewsFormBuilder: CreateEditNewsFormBuilder,
              private createEcoNewsService: CreateEcoNewsService,
              private ecoNewsService: EcoNewsService,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              @Inject(ACTION_TOKEN) private config: {[name: string]: ActionInterface}) { }

  ngOnInit() {
    this.getNewsIdFromQueryParams();

    if (this.newsId) {
      this.fetchNewsItemToEdit();
      this.attributes = this.config.edit;
    } else {
      this.form = this.createEditNewsFormBuilder.getSetupForm();
      this.attributes = this.config.create;
      this.onSourceChange();
    }
    this.setFormItems();

  }

  private setFormItems(): void {
    if (this.createEcoNewsService.isBackToEditing) {
      this.formData = this.createEcoNewsService.getFormData();
      if (this.formData) {
        this.patchFilters();
        this.form.patchValue({
          title: this.formData.value.title,
          content: this.formData.value.content,
          source: this.formData.value.source,
        });
      }
    }
    console.log(this.form);
  }

  private patchFilters(): void {
    this.filters.forEach(filter => {
      if (this.formData.value.tags.includes(filter.name.toLowerCase())) {
        filter.isActive = true;
        this.isArrayEmpty = false;
      }
    });
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
    this.form.get('source').valueChanges.subscribe((source: string) => {
      this.isLinkOrEmpty = /^$|^https?:\/\//.test(source);
    });
  }

  public onSubmit(): void {
    this.isPosting = true;
    this.createEcoNewsService.sendFormData(this.form).subscribe(
      () => {
        this.isPosting = false;
        this.router.navigate(['/news']);
      }
    );
  }

  private fetchNewsItemToEdit(): void {
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

  private setActiveFilters(itemToUpdate: EcoNewsModel): void {
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

  public addFilters(filter: FilterModel): void {
    if (!filter.isActive) {
      this.toggleIsActive(filter, true);
      this.isArrayEmpty = false;
      this.form.value.tags.push(filter.name.toLowerCase());
      this.filtersValidation(filter);
    } else {
      this.removeFilters(filter);
    }
  }

  public removeFilters(filter: FilterModel): void {
    const tagsArray = this.form.value.tags;
    if (filter.isActive && tagsArray.length === 1) {
      this.isArrayEmpty = true;
    }
    this.form.value.tags = tagsArray.filter((item: string) => {
      return item.toLowerCase() !== filter.name.toLowerCase();
    });
    this.toggleIsActive(filter, false);

  }

  public filtersValidation(filter: FilterModel): void {
    if (this.form.value.tags.length > 3) {
      this.isFilterValidation = true;
      setTimeout(() => this.isFilterValidation = false, 3000);
      this.form.value.tags = this.form.value.tags.slice(0, 3);
      this.toggleIsActive(filter, false);
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
    this.router.navigate(['news', 'preview']);
    // this.setFilters();
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
