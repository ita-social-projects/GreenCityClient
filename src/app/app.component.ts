import { Component, ElementRef, OnInit } from '@angular/core';
import { LanguageService } from './i18n/language.service';
import { NavigationEnd, Router } from '@angular/router';
import { TitleAndMetaTagsService } from './service/title-meta-tags/title-and-meta-tags.service';
import { SearchService } from './service/search/search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  constructor(
    private languageService: LanguageService,
    private titleAndMetaTagsService: TitleAndMetaTagsService,
    private router: Router,
    private clickSearch: SearchService,
    private elRef: ElementRef,
  ) {}

  ngOnInit() {
    this.languageService.setDefaultLanguage();
    this.navigateToStartingPositionOnPage();
    this.titleAndMetaTagsService.useTitleMetasData();
    this.clickSearch.SearchEmitter.subscribe(this.openSearchSubscription.bind(this));
  }

  private openSearchSubscription(signal: boolean): void {
    signal ? (this.elRef.nativeElement.ownerDocument.body.style.overflow = 'hidden') :
             (this.elRef.nativeElement.ownerDocument.body.style.overflow = 'auto');
  }

  private navigateToStartingPositionOnPage(): void {
    this.router.events.subscribe(navigationEvent => {
      if (navigationEvent instanceof NavigationEnd) {
        window.scroll(0, 0);
      }
    });
  }
}
