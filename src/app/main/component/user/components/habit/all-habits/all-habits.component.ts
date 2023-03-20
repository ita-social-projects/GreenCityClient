import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { HabitService } from '@global-service/habit/habit.service';
import { HabitInterface, HabitListInterface } from '../../../../../interface/habit/habit.interface';
import { singleNewsImages } from '../../../../../image-pathes/single-news-images';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { HabitAssignInterface } from 'src/app/main/interface/habit/habit-assign.interface';
import { TagInterface } from '@shared/components/tag-filter/tag-filter.model';

@Component({
  selector: 'app-all-habits',
  templateUrl: './all-habits.component.html',
  styleUrls: ['./all-habits.component.scss']
})
export class AllHabitsComponent implements OnInit, OnDestroy {
  public habitsList: HabitInterface[] = [];
  public totalHabits = 0;
  public galleryView = true;
  public isFetching = true;
  public tagList: TagInterface[] = [];
  public selectedTagsList: Array<string> = [];
  public windowSize: number;
  private currentPage = 0;
  private pageSize = 6;
  private isAllPages: boolean;
  private totalPages: number;
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  private lang: string;
  public images = singleNewsImages;

  constructor(
    private habitService: HabitService,
    private localStorageService: LocalStorageService,
    private translate: TranslateService,
    public profileService: ProfileService,
    public habitAssignService: HabitAssignService
  ) {}

  ngOnInit() {
    this.onResize();
    this.checkHabitsView();

    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroyed$)).subscribe((lang) => {
      this.translate.setDefaultLang(lang);
      this.lang = lang;
      this.getAllHabitsTags();
    });
  }

  private getAllHabitsTags(): void {
    this.habitService
      .getAllTags()
      .pipe(take(1))
      .subscribe((tagsArray: Array<TagInterface>) => (this.tagList = tagsArray));
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

  private getHabitsByTags(page: number, size: number, tags: string[]): void {
    this.habitService
      .getHabitsByTagAndLang(page, size, tags)
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

  public getFilterData(tags: Array<string>): void {
    if (this.tagList.length) {
      this.selectedTagsList = tags;
      tags.length ? this.getHabitsByTags(0, this.pageSize, this.selectedTagsList) : this.getAllHabits(0, this.pageSize);
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
      this.selectedTagsList.length
        ? this.getHabitsByTags(this.currentPage, this.pageSize, this.selectedTagsList)
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
            }
          });
        });
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
