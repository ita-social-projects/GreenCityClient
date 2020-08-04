import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreateEcoNewsService } from '@eco-news-service/create-eco-news.service';
import { FilterModel, LanguageModel, NewsResponseDTO } from '@eco-news-models/create-news-interface';
import { CreateNewsCancelComponent } from '../../../shared/components/create-news-cancel/create-news-cancel.component';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.scss']
})
export class CreateNewsComponent implements OnInit {
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
  public isLink = false;
  public formData: FormGroup;
  public isArrayEmpty = true;
  public author: string = localStorage.getItem('name');
  public textAreasHeight = {
    minTextAreaScrollHeight: 50,
    maxTextAreaScrollHeight: 128,
    minTextAreaHeight: '48px',
    maxTextAreaHeight: '128px',
  };

  constructor(private router: Router,
              private fb: FormBuilder,
              private createEcoNewsService: CreateEcoNewsService,
              private dialog: MatDialog) {}

  ngOnInit() {
    this.onSourceChange();
    this.setFormItems();
    this.setEmptyForm();
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

  private navigateByUrl(url: string): void {
    this.router.navigateByUrl(url);
  }

  public onSourceChange(): void {
    this.createNewsForm.get('source').valueChanges.subscribe(source => {
      this.isLink = source.startsWith('http://') ||
                    source.startsWith('https://') ||
                    source.length === 0 ? false : true;
    });
  }

  public onSubmit(): void {
    this.isPosting = true;
    this.setFilters();
    this.createEcoNewsService.sendFormData(this.createNewsForm).subscribe(
      (successRes: NewsResponseDTO) => {
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
    if ( filter.isActive ) {
      filter.isActive = false;
      if (this.createNewsForm.value.tags.length === 1) {
        this.isArrayEmpty = true;
      }
      this.createNewsForm.value.tags.forEach((item, index) => {
        if (item.toLowerCase() === filter.name.toLowerCase()) {
          this.createNewsForm.value.tags = [
            ...this.createNewsForm.value.tags.slice(0, index),
            ...this.createNewsForm.value.tags.slice(index + 1)
          ];
          this.filtersValidation(filter);
        }
      });
    }
  }

  public filtersValidation(filter: FilterModel): void {
    if ( this.createNewsForm.value.tags.length > 3) {
      this.isFilterValidation = true;
      setTimeout(() => this.isFilterValidation = false, 3000);
      this.createNewsForm.value.tags = [
        ...this.createNewsForm.value.tags.slice(0, 3)
      ];
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
      this.formData.value.tags.forEach(tag => {
      if (filter.name.toLowerCase() === tag) {
          filter.isActive = true;
          this.isArrayEmpty = false;
        }
      });
    });
  }

  private goToPreview(): void {
    this.createEcoNewsService.setForm(this.createNewsForm);
    this.router.navigate(['news', 'preview']);
    this.setFilters();
  }

  private openCancelPopup(): void {
    this.dialog.open(CreateNewsCancelComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'custom-dialog-container',
    });
  }
}
