import { Component, OnInit, DoCheck } from '@angular/core';
import { preparedImageForCreateEcoNews } from '../../../../links';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { CreateEcoNewsService } from '../../../../service/eco-news/create-eco-news.service';
import { FilterModel, LanguageModel } from './create-news-interface';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.css']
})
export class CreateNewsComponent implements OnInit, DoCheck {

  constructor(private router: Router, 
              private fb: FormBuilder, 
              private createEcoNewsService: CreateEcoNewsService) {}

  public createNewsForm = this.fb.group({
    title: ['', [Validators.maxLength(170)]],
    source: [''],
    content: ['', [Validators.minLength(20)]],
    tags: this.fb.array([])
  });

  public filters: Array<FilterModel> = [
    {name: 'News', isActive: false},
    {name: 'Events', isActive: false}, 
    {name: 'Courses', isActive: false}, 
    {name: 'Initiatives', isActive: false}, 
    {name: 'Ads', isActive: false}
  ];

  public activeLanguage: string = 'en';
  public link: string;
  private preparedLink: string = preparedImageForCreateEcoNews;
  private date: Date = new Date();
  public formValid: boolean;

  public languages: Array<LanguageModel> = [
    {name: 'Ukrainian', lang: 'ua'},
    {name: 'English', lang: 'en'},
    {name: 'Russian', lang: 'ru'},
  ];

  ngOnInit() {
    this.link = this.preparedLink;
    this.onSourceChange();
  }

  ngDoCheck() {
    if ( !this.createNewsForm.value.title || !this.createNewsForm.value.content ) {
      this.formValid = true;
    } else {
      this.formValid = false;
    }
  }
  
  private navigateByUrl(): void {
    this.router.navigateByUrl('/news');
  }

  public onSourceChange(): void {
    this.createNewsForm.get('source').valueChanges.subscribe(source => {
      if ( !source ) {
        this.link = this.preparedLink;
      } else {
        this.link = source;
      }
    });
  }

  public onSubmit(): void {
    this.createEcoNewsService.sendFormData(this.createNewsForm, this.activeLanguage).subscribe(
      (data: object) => {
        console.log(data);
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
    }  
    this.createEcoNewsService.setTranslationByLang(this.activeLanguage, formData);
    this.activeLanguage = language.lang;
    this.bindFormValue();
  }
}