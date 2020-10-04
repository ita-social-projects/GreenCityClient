import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { FilterModel } from '@eco-news-models/create-news-interface';
import { CreateEcoNewsService } from '@eco-news-service/create-eco-news.service';
import { CancelPopUpComponent } from '@shared/components';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-news-details-form',
  templateUrl: './news-details-form.component.html',
  styleUrls: ['./news-details-form.component.scss']
})
export class NewsDetailsFormComponent implements OnInit {
  public isPosting = false;
  public isArrayEmpty = true;
  public isFilterValidation = false;
  public isLinkOrEmpty = true;
  public formData: FormGroup;
  public year: number = new Date().getFullYear();
  public day: number = new Date().getDate();
  public month: number = new Date().getMonth();
  public author: string = localStorage.getItem('name');

  public textAreasHeight = {
    minTextAreaScrollHeight: 50,
    maxTextAreaScrollHeight: 128,
    minTextAreaHeight: '48px',
    maxTextAreaHeight: '128px',
  };

  public filters: Array<FilterModel> = [
    {name: 'News', isActive: false},
    {name: 'Events', isActive: false},
    {name: 'Education', isActive: false},
    {name: 'Initiatives', isActive: false},
    {name: 'Ads', isActive: false}
  ];

  title = this.fb.control('');
  source = this.fb.control('');
  content = this.fb.control('');
  tags = this.fb.control([]);
  image = this.fb.control('');

  public formGroupNews = this.fb.group({
    title: this.title,
    source: this.source,
    content: this.content,
    tags: this.tags,
    image: this.image,
  });

  constructor(
    private fb: FormBuilder,
    public createEcoNewsService: CreateEcoNewsService,
    public dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit() {
    this.createEcoNewsService.currentPageElementsSubject
      .pipe(
        filter(Boolean)
      )
      .subscribe(data => {
        console.log(data);
        this.formGroupNews.patchValue({
          title: data[0].title,
          content: data[0].text,
          source: data[0].source,
          image: data[0].imagePath,
          tags: data[0].tags
        });
      });
    this.onSourceChange();
    this.setFormItems();
    this.setEmptyForm();
  }

  public setEmptyForm(): void {
    if (this.formData) {
      this.createEcoNewsService.setForm(null);
    }
  }

  public onSubmit(): void {
    this.isPosting = true;
    this.setFilters();
    this.createEcoNewsService.sendFormData(this.formGroupNews).subscribe(
      () => {
        this.isPosting = false;
        this.router.navigate(['/news']);
      }
    );
  }

  public setFormItems(): void {
    if (this.createEcoNewsService.isBackToEditing) {
      this.formData = this.createEcoNewsService.getFormData();
      if (this.formData) {
        this.patchFilters();
        this.formGroupNews.patchValue({
          title: this.formData.value.title,
          content: this.formData.value.text,
          source: this.formData.value.source,
          image: this.formData.value.imagePath,
          tags: this.formData.value.tags
        });
      }
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

  public autoResize(event): void {
    const checkTextAreaHeight = event.target.scrollHeight > this.textAreasHeight.minTextAreaScrollHeight
      && event.target.scrollHeight < this.textAreasHeight.maxTextAreaScrollHeight;
    const maxHeight = checkTextAreaHeight ? this.textAreasHeight.maxTextAreaHeight
      : event.target.scrollHeight < this.textAreasHeight.minTextAreaScrollHeight;
    const minHeight = checkTextAreaHeight ? this.textAreasHeight.minTextAreaHeight : `${event.target.scrollHeight}px`;
    event.target.style.height = checkTextAreaHeight ? maxHeight : minHeight;
  }

  public addFilters(filter: FilterModel): void {
    if ( !filter.isActive ) {
      filter.isActive = true;
      this.isArrayEmpty = false;
      this.formGroupNews.value.tags = [...this.formGroupNews.value.tags, filter.name.toLowerCase()];
      this.filtersValidation(filter);
    } else {
      this.removeFilters(filter);
    }
  }

  public filtersValidation(filter: FilterModel): void {
    if ( this.formGroupNews.value.tags.length > 3) {
      this.isFilterValidation = true;
      setTimeout(() => this.isFilterValidation = false, 3000);
      this.formGroupNews.value.tags = this.formGroupNews.value.tags.slice(0, 3);
      filter.isActive = false;
    }
  }

  public removeFilters(filter: FilterModel): void {
    const tagsArray = this.formGroupNews.value.tags;
    if ( filter.isActive && tagsArray.length === 1 ) {
      this.isArrayEmpty = true;
    }
    this.formGroupNews.value.tags = tagsArray.filter(item => item.toLowerCase() !== filter.name.toLowerCase());
    filter.isActive = false;
  }

  public onSourceChange(): void {
    if (this.formGroupNews) {
      this.formGroupNews.get('source').valueChanges.subscribe(source => {
        this.isLinkOrEmpty = /^$|^https?:\/\//.test(source);
      });
    }
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

  public goToPreview(): void {
    this.createEcoNewsService.setForm(this.formGroupNews);
    this.router.navigate(['news', 'preview']);
    this.setFilters();
  }

  private setFilters(): void {
    if (this.formData) {
      this.formData.value.tags.forEach(tag => {
        this.filters.forEach(filter => {
          if (filter.name.toLowerCase() === tag &&
            filter.isActive &&
            !this.formGroupNews.value.tags.includes(tag)) {
            this.formGroupNews.value.tags = [...this.formGroupNews.value.tags, tag];
            this.filtersValidation(filter);
          }
        });
      });
    }
  }
}
