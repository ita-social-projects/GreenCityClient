import { Component, ElementRef, OnInit } from '@angular/core';
import { LanguageService } from './i18n/language.service';
import { NavigationEnd, Router } from '@angular/router';
import { TitleAndMetaTagsService } from './service/title-meta-tags/title-and-meta-tags.service';
import { SearchService } from './service/search/search.service';
import { UiActionsService } from '@global-service/ui-actions/ui-actions.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
  public toggle: boolean;

  constructor(
    private languageService: LanguageService,
    private titleAndMetaTagsService: TitleAndMetaTagsService,
    private router: Router,
    private searchSearch: SearchService,
    private elRef: ElementRef,
    private uiActionsService: UiActionsService,
  ) {}

  ngOnInit() {
    this.languageService.setDefaultLanguage();
    this.navigateToStartingPositionOnPage();
    this.titleAndMetaTagsService.useTitleMetasData();
    this.uiActionsService.stopScrollingSubject.subscribe(data => this.toggle = data);
    this.updatePage();
  }

  private navigateToStartingPositionOnPage(): void {
    this.router.events.subscribe(navigationEvent => {
      if (navigationEvent instanceof NavigationEnd) {
        window.scroll(0, 0);
      }
    });
  }

  private updatePage(): void {
    this.router.events.subscribe(evt =>
        this.router.routeReuseStrategy.shouldReuseRoute = () => false
      );
  }
}
