import { Component, OnInit } from '@angular/core';
import { preparedImageForCreateEcoNews } from '../../../../links';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { CreateEcoNewsService } from '../../../../service/eco-news/create-eco-news.service';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.css']
})
export class CreateNewsComponent implements OnInit {

  constructor(private router: Router, 
              private fb: FormBuilder, 
              private createEcoNewsService: CreateEcoNewsService) {}

  public createNewsForm = this.fb.group({
    title: ['', [Validators.maxLength(170), Validators.required]],
    source: [''],
    content: ['', [Validators.minLength(20), Validators.required]],
    tags: this.fb.array([])
  });

  public filters: Array<any> = [
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

  public languages: Array<any> = [
    {name: 'Ukrainian', lang: 'ua'},
    {name: 'English', lang: 'en'},
    {name: 'Russian', lang: 'ru'},
  ];

  ngOnInit() {
    this.link = this.preparedLink;
    this.onChanges();
  }

  private navigateByUrl(): void {
    this.router.navigateByUrl('/news');
  }

  public onChanges(): void {
    this.createNewsForm.get('source').valueChanges.subscribe(source => {
      if(!source) {
        this.link = this.preparedLink;
      } else {
        this.link = source;
      }
    });
  }

  public onSubmit(): void {
    console.log(this.createNewsForm.value);
  }

  private addFilters(filter: any): void { 
    if(!filter.isActive) {
      filter.isActive = true;
      this.createNewsForm.value.tags.push(filter.name);
    } else {
      filter.isActive = false;
      this.createNewsForm.value.tags.forEach((item, index) => {
        if (item === filter.name) {
          this.createNewsForm.value.tags.splice(index, 1);
        }
      })
    }
  }

  public changeLanguage(language: any): void {
    let formData = {
      text: this.createNewsForm.value['content'],
      title: this.createNewsForm.value['title']
    }  

    this.createEcoNewsService.setTranslationByLang(this.activeLanguage, formData);

    this.activeLanguage = language.lang;
    let translationData = this.createEcoNewsService.getTranslationByLang(this.activeLanguage);
    this.createNewsForm.patchValue({
      title: translationData.title,
      content: translationData.text
    });
  }
}