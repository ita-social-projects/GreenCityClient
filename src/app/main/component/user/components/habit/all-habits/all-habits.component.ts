import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { HabitService } from '@global-service/habit/habit.service';
import { HabitInterface, HabitListInterface } from '../models/interfaces/habit.interface';
import { singleNewsImages } from '../../../../../image-pathes/single-news-images';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { HabitAssignInterface } from '../models/interfaces/habit-assign.interface';
import { TagInterface } from '@shared/components/tag-filter/tag-filter.model';
import { Router } from '@angular/router';
import { FilterOptions, FilterSelect } from 'src/app/main/interface/filter-select.interface';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { HabitsFiltersList } from '../models/habits-filters-list';

@Component({
  selector: 'app-all-habits',
  templateUrl: './all-habits.component.html',
  styleUrls: ['./all-habits.component.scss']
})
export class AllHabitsComponent implements OnInit, OnDestroy {
  habitsList: HabitInterface[] = [];
  totalHabits = 0;
  galleryView = true;
  isFetching = true;
  tagList: TagInterface[] = [];
  selectedTagsList: Array<string> = [];
  activeFilters: string[] = [];
  windowSize: number;
  private currentPage = 0;
  private pageSize = 6;
  private isAllPages: boolean;
  private totalPages: number;
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  private lang: string;
  public images = singleNewsImages;

  filtersList: FilterSelect[] = HabitsFiltersList;

  constructor(
    private habitService: HabitService,
    private localStorageService: LocalStorageService,
    private translate: TranslateService,
    private langService: LanguageService,
    public profileService: ProfileService,
    public habitAssignService: HabitAssignService,
    public router: Router
  ) {}

  ngOnInit() {
    this.onResize();
    this.checkHabitsView();

    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroyed$)).subscribe((lang) => {
      this.translate.setDefaultLang(lang);
      this.lang = lang;
      this.getAllHabitsTags();
      this.getAllHabits(0, this.pageSize);
    });
  }

  private getAllHabitsTags(): void {
    this.habitService
      .getAllTags()
      .pipe(take(1))
      .subscribe((tagsArray: Array<TagInterface>) => {
        this.tagList = tagsArray;
        const options = [];
        this.tagList.map((tag: TagInterface) => {
          const item = {
            name: tag.name,
            nameUa: tag.nameUa,
            value: tag.name,
            isActive: false
          };
          options.push(item);
          this.filtersList[0].options = options;
        });
      });
  }

  public checkHabitsView(): void {
    const galleryView = this.localStorageService.getHabitsGalleryView();
    this.galleryView = galleryView ?? this.galleryView;
  }

  private getAllHabits(page: number, size: number): void {
    this.habitService
      .getAllHabits(page, size)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        this.setHabitsList(page, res);
      });
  }

  private getHabitsByFilters(page: number, size: number, filters: string[]): void {
    this.habitService
      .getHabitsByFilters(page, size, this.lang, filters)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        this.setHabitsList(page, res);
      });
  }

  private setHabitsList(page: number, res: HabitListInterface): void {
    this.isFetching = false;
    this.habitsList = page ? [...this.habitsList, ...res.page] : res.page;
    this.totalHabits = res.totalElements;
    this.totalPages = res.totalPages;
    this.currentPage = res.currentPage;
    page += 1;
    this.isAllPages = this.totalPages === page;
    if (this.totalHabits) {
      this.checkIfAssigned();
    }
  }

  public onDisplayModeChange(mode: boolean): void {
    this.galleryView = mode;
    this.localStorageService.setHabitsGalleryView(mode);
  }

  setSelectedAll(filterChange: FilterSelect): void {
    const selectedInd = this.filtersList.findIndex((el) => el.name === filterChange.name);
    if (selectedInd >= 0) {
      this.filtersList[selectedInd] = filterChange;
    }
  }

  setFilters(filterChange: FilterSelect): void {
    this.activeFilters = [];
    const selectedInd = this.filtersList.findIndex((el) => el.name === filterChange.name);
    if (selectedInd >= 0) {
      this.filtersList[selectedInd] = filterChange;
      const filtersActive = this.filtersList.filter((item) => !item.isAllSelected);
      filtersActive.forEach((el: FilterSelect) => {
        const activeOptions = el.options.filter((el) => el.isActive);
        if (activeOptions.length) {
          const queryString = `${el.name}=${activeOptions.map((option) => option.value).join('%2C')}`;
          this.activeFilters.push(queryString);
        }
      });
      filtersActive.length && this.activeFilters.length
        ? this.getHabitsByFilters(0, this.pageSize, this.activeFilters)
        : this.getAllHabits(0, this.pageSize);
    }
  }

  public onResize(): void {
    this.windowSize = window.innerWidth;
    this.galleryView = this.windowSize >= 576 ? this.galleryView : true;
  }

  public onScroll(): void {
    this.isFetching = false;
    if (!this.isAllPages) {
      this.isFetching = true;
      this.currentPage += 1;
      this.activeFilters.length
        ? this.getHabitsByFilters(this.currentPage, this.pageSize, this.activeFilters)
        : this.getAllHabits(this.currentPage, this.pageSize);
    }
  }

  public checkIfAssigned(): void {
    this.habitAssignService
      .getAssignedHabits()
      .pipe(take(1))
      .subscribe((response: Array<HabitAssignInterface>) => {
        response.forEach((assigned) => {
          this.habitsList.forEach((filtered) => {
            if (assigned.habit.id === filtered.id && assigned.status === 'INPROGRESS') {
              filtered.isAssigned = true;
              filtered.assignId = assigned.id;
            }
          });
        });
      });
  }

  public goToCreateHabit(): void {
    const userId = localStorage.getItem('userId');
    this.router.navigate([`profile/${userId}/create-habit`]);
  }

  getLangValue(uaValue: string, enValue: string): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
