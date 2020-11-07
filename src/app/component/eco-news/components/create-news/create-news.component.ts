import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { CreateEcoNewsService } from '@eco-news-service/create-eco-news.service';
import { FilterModel } from '@eco-news-models/create-news-interface';
import { ComponentCanDeactivate } from '@global-service/pending-changes-guard/pending-changes.guard';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.scss']
})
export class CreateNewsComponent implements OnInit, ComponentCanDeactivate {
  public isPosting = false;

  public createNewsForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(170), this.noWhitespaceValidator]],
    source: [''],
    content: ['', [Validators.required, Validators.minLength(20)]],
    tags: this.fb.array([]),
    image: ['']
  });

  public filters: Array<FilterModel> = [
    {name: 'News', isActive: false},
    {name: 'Events', isActive: false},
    {name: 'Education', isActive: false},
    {name: 'Initiatives', isActive: false},
    {name: 'Ads', isActive: false}
  ];

  public year: number = new Date().getFullYear();
  public day: number = new Date().getDate();
  public month: number = new Date().getMonth();
  public isFilterValidation = false;
  public isLinkOrEmpty = true;
  public formData: FormGroup;
  public isArrayEmpty = true;
  public author: string = localStorage.getItem('name');
  public textAreasHeight = {
    minTextAreaScrollHeight: 50,
    maxTextAreaScrollHeight: 128,
    minTextAreaHeight: '48px',
    maxTextAreaHeight: '128px',
  };

  private areChangesSaved = false;
  public popupConfig = {
    hasBackdrop: true,
    closeOnNavigation: true,
    disableClose: true,
    panelClass: 'popup-dialog-container',
    data: {
      popupTitle: 'homepage.eco-news.news-popup.title',
      popupSubtitle: 'homepage.eco-news.news-popup.subtitle',
      popupConfirm: 'homepage.eco-news.news-popup.confirm',
      popupCancel: 'homepage.eco-news.news-popup.cancel',
    }
  };

  constructor(private router: Router,
              private fb: FormBuilder,
              public createEcoNewsService: CreateEcoNewsService) {}

  ngOnInit() {
    this.onSourceChange();
    this.setFormItems();
    this.setEmptyForm();
  }

  @HostListener('window:beforeunload', ['$event'])

  canDeactivate(): boolean | Observable<boolean> {
    if (this.areChangesSaved) {
      return true;
    } else {
      const body = this.createNewsForm.value;
      for (const key of Object.keys(body)) {
        if (Array.isArray(body[key])) {
          if (body[key].some(item => item)) {
            return false;
          }
        } else {
          if (body[key]) {
            return false;
          }
        }
      }
      return true;
    }
  }

  private setFormItems(): void {
    if (this.createEcoNewsService.isBackToEditing) {
      this.formData = this.createEcoNewsService.getFormData();
      if (this.formData) {
        this.patchFilters();
        this.createNewsForm.patchValue({
          title: this.formData.value.title,
          content: this.formData.value.content,
          source: this.formData.value.source,
        });
      }
    }
  }

  public autoResize(event): void {
    const checkTextAreaHeight = event.target.scrollHeight > this.textAreasHeight.minTextAreaScrollHeight
      && event.target.scrollHeight < this.textAreasHeight.maxTextAreaScrollHeight;
    const maxHeight = checkTextAreaHeight ? this.textAreasHeight.maxTextAreaHeight
      : event.target.scrollHeight < this.textAreasHeight.minTextAreaScrollHeight;
    const minHeight = checkTextAreaHeight ? this.textAreasHeight.minTextAreaHeight : `${event.target.scrollHeight}px`;
    event.target.style.height = checkTextAreaHeight ? maxHeight : minHeight;
  }

  private setEmptyForm(): void {
    if (this.formData) {
      this.createEcoNewsService.setForm(null);
    }
  }

  public onSourceChange(): void {
    this.createNewsForm.get('source').valueChanges.subscribe(source => {
      this.isLinkOrEmpty = /^$|^https?:\/\//.test(source);
    });
  }

  public onSubmit(): void {
    this.areChangesSaved = true;
    this.isPosting = true;
    this.setFilters();
    this.createEcoNewsService.sendFormData(this.createNewsForm).subscribe(
      () => {
        this.isPosting = false;
        this.router.navigate(['/news']);
      }
    );
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhiteSpace = (control.value || '').trim().length === 0;
    const isValid = !isWhiteSpace;
    return isValid ? null : { whitespace: true };
  }

  public addFilters(filter: FilterModel): void {
    if ( !filter.isActive ) {
      filter.isActive = true;
      this.isArrayEmpty = false;
      this.createNewsForm.value.tags = [...this.createNewsForm.value.tags, filter.name.toLowerCase()];
      this.filtersValidation(filter);
    } else {
      this.removeFilters(filter);
    }
  }

  public removeFilters(filter: FilterModel): void {
    const tagsArray = this.createNewsForm.value.tags;
    if ( filter.isActive && tagsArray.length === 1 ) {
      this.isArrayEmpty = true;
    }
    this.createNewsForm.value.tags = tagsArray.filter(item => item.toLowerCase() !== filter.name.toLowerCase());
    filter.isActive = false;
  }

  public filtersValidation(filter: FilterModel): void {
    if ( this.createNewsForm.value.tags.length > 3) {
      this.isFilterValidation = true;
      setTimeout(() => this.isFilterValidation = false, 3000);
      this.createNewsForm.value.tags = this.createNewsForm.value.tags.slice(0, 3);
      filter.isActive = false;
    }
  }

  private setFilters(): void {
    if (this.formData) {
      this.formData.value.tags.forEach(tag => {
        this.filters.forEach(filter => {
          if (filter.name.toLowerCase() === tag &&
            filter.isActive &&
            !this.createNewsForm.value.tags.includes(tag)) {
            this.createNewsForm.value.tags = [...this.createNewsForm.value.tags, tag];
            this.filtersValidation(filter);
          }
        });
      });
    }
  }

  private patchFilters(): void {
    this.filters.forEach(filter => {
      if (this.formData.value.tags.includes(filter.name.toLowerCase())) {
        filter.isActive = true;
        this.isArrayEmpty = false;
      }
    });
  }

  public goToPreview(): void {
    this.areChangesSaved = true;
    this.createEcoNewsService.setForm(this.createNewsForm);
    this.router.navigate(['news', 'preview']);
    this.setFilters();
  }

  private cancelCreating(): void {
    this.router.navigate(['news']);
  }
}
