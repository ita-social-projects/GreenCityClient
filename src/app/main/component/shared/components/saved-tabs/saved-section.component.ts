import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-saved-section',
  templateUrl: './saved-section.component.html',
  styleUrls: ['./saved-section.component.scss']
})
export class SavedSectionComponent implements OnInit {
  @Input() tabs = [
    { key: 'news', label: 'homepage.saved.eco-news' },
    { key: 'events', label: 'homepage.saved.events' },
    { key: 'places', label: 'homepage.saved.places' }
  ];
  @Input() defaultTab = 'news';
  @Output() tabChange = new EventEmitter<string>();

  currentTab = this.defaultTab;
  isSavedVisible = false;

  private isBookmark$ = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.isBookmark$.next(params['isBookmark'] === 'true');
      this.currentTab = params['section'] || this.defaultTab;
      this.isSavedVisible = this.isBookmark$.value;
    });
  }

  navigateToSaved(section: string): void {
    this.router.navigate([`/${section}`], {
      queryParams: { isBookmark: true, section }
    });
    this.currentTab = section;
    this.tabChange.emit(section);
  }
}
