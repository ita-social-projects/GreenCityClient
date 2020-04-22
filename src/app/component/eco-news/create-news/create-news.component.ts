import { Component, OnInit } from '@angular/core';
import { preparedImageForCreateEcoNews } from '../../../links';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { CreateEcoNewsService } from '../../../service/eco-news/create-eco-news.service';
import { FilterModel, LanguageModel, NewsResponseDTO } from './create-news-interface';
import { MatDialog } from '@angular/material/dialog';
import { CreateNewsCancelComponent } from './create-news-cancel/create-news-cancel.component';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.css']
})
export class CreateNewsComponent implements OnInit {
  public isPosting: boolean = false;

  public createNewsForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(170)]],
    source: [''],
    content: ['', [Validators.required, Validators.minLength(20)]],
    tags: this.fb.array([])
  });

  public filters: Array<FilterModel> = [
    {name: 'News', isActive: false},
    {name: 'Events', isActive: false},
    {name: 'Courses', isActive: false},
    {name: 'Initiatives', isActive: false},
    {name: 'Ads', isActive: false}
  ];

  public languages: Array<LanguageModel> = [
    {name: 'Ukrainian', lang: 'ua'},
    {name: 'English', lang: 'en'},
    {name: 'Russian', lang: 'ru'},
  ];

  public activeLanguage: string = 'en';
  public link: string;
  private preparedLink: string = preparedImageForCreateEcoNews;
  private date: Date = new Date();

  constructor(private router: Router,
              private fb: FormBuilder,
              private createEcoNewsService: CreateEcoNewsService,
              private dialog: MatDialog) {}

  ngOnInit() {
    this.link = this.preparedLink;
    this.onSourceChange();
  }

  private navigateByUrl(url: string): void {
    this.router.navigateByUrl(url);
  }

  public onSourceChange(): void {
    this.createNewsForm.get('source').valueChanges.subscribe(source => {
      this.link = !source ? this.preparedLink : source;
    });
  }

  public onSubmit(): void {
    this.isPosting = true;
    this.createEcoNewsService.sendFormData(this.createNewsForm, this.activeLanguage).subscribe(
      (successRes: NewsResponseDTO) => {
        this.isPosting = false;
        this.router.navigate(['/news']);
      }
    );
  }

  public addFilters(filter: FilterModel): void {
    if ( !filter.isActive ) {
      filter.isActive = true;
      this.createNewsForm.value.tags.push(filter.name.toLowerCase());
    } else {
      this.removeFilters(filter);
    }
  }

  public removeFilters(filter: FilterModel): void {
    if ( filter.isActive ) {
      filter.isActive = false;
      this.createNewsForm.value.tags.forEach((item, index) => {
        if (item.toLowerCase() === filter.name.toLowerCase()) {
          this.createNewsForm.value.tags.splice(index, 1);
        }
      })
    }
  }

  public bindFormValue(): void {
    const translationData = this.createEcoNewsService.getTranslationByLang(this.activeLanguage);
    this.createNewsForm.patchValue({
      title: translationData.title,
      content: translationData.text
    });
  }

  public changeLanguage(language: LanguageModel): void {
    const formData = {
      text: this.createNewsForm.value['content'],
      title: this.createNewsForm.value['title']
    };

    this.createEcoNewsService.setTranslationByLang(this.activeLanguage, formData);
    this.createNewsForm.reset();
    this.activeLanguage = language.lang;
    this.bindFormValue();
  }

  private goToPreview(): void {
    this.createEcoNewsService.setForm(this.createNewsForm);
    this.createEcoNewsService.setLang(this.activeLanguage);
    this.navigateByUrl('create-news/preview');
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
