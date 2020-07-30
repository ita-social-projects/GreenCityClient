import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { CreateEcoNewsService } from '../../services/create-eco-news.service';
import { FilterModel, LanguageModel, NewsResponseDTO } from '../../models/create-news-interface';
import { MatDialog } from '@angular/material/dialog';
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

  public autoResize(event) {
    event.target.scrollHeight > 100 ?
      event.target.style.height = '131px' : event.target.style.height = '48px';
    event.target.style.height = `${event.target.scrollHeight}px`;
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
      source.startsWith('http://') ||
      source.startsWith('https://') ||
      source.length === 0 ? this.isLink = false : this.isLink = true;
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
      this.createNewsForm.value.tags.push(filter.name.toLowerCase());
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
          this.createNewsForm.value.tags.splice(index, 1);
          this.filtersValidation(filter);
        }
      });
    }
  }

  public filtersValidation(filter: FilterModel): void {
    if ( this.createNewsForm.value.tags.length > 3) {
      this.isFilterValidation = true;
      setTimeout(() => this.isFilterValidation = false, 3000);
      this.createNewsForm.value.tags.splice(3, 1);
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
            this.createNewsForm.value.tags.push(tag);
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
