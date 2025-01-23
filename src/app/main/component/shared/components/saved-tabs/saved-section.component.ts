import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-saved-section',
  templateUrl: './saved-section.component.html',
  styleUrls: ['./saved-section.component.scss']
})
export class SavedSectionComponent implements OnInit, OnDestroy {
  @Input() tabs = [
    { key: 'news', label: 'homepage.saved.eco-news' },
    { key: 'events', label: 'homepage.saved.events' },
    { key: 'places', label: 'homepage.saved.places' }
  ];
  @Input() defaultTab = 'news';
  @Output() tabChange = new EventEmitter<string>();

  currentTab = this.defaultTab;
  isSavedVisible = false;

  private readonly isBookmark$ = new BehaviorSubject<boolean>(false);
  private destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.isBookmark$.next(params['isBookmark'] === 'true');
      this.currentTab = params['section'] || this.defaultTab;
      this.isSavedVisible = this.isBookmark$.value;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToSaved(section: string): void {
    this.router.navigate([`/${section}`], {
      queryParams: { isBookmark: true, section }
    });
    this.currentTab = section;
    this.tabChange.emit(section);
  }
}
