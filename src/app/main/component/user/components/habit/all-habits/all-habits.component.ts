import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, ReplaySubject, Subscription } from 'rxjs';
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
  public allHabits = new BehaviorSubject<any>([]);
  public filteredHabitsList: HabitInterface[] = [];
  public totalHabits: number;
  public totalHabitsCopy = 0;
  public galleryView = true;
  public isFetching = true;
  public elementsLeft = true;
  public tagList: TagInterface[] = [];
  public tags = this.habitService.getAllTags();
  public tagsList: Array<string> = [];
  public windowSize: number;
  private currentPage = 0;
  private totalPages: number;
  private masterSubscription: Subscription = new Subscription();
  private habitsList: HabitInterface[] = [];
  private lang: string;
  private batchSize = 6;
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

    const langChangeSub = this.localStorageService.languageBehaviourSubject.subscribe((lang) => {
      this.translate.setDefaultLang(lang);
      this.lang = lang;
      this.resetState();
      this.resetSubject();
      this.fetchAllHabits(0, this.batchSize);
      this.getAllHabitsTags();
    });

    const habitServiceSub = this.allHabits.subscribe((data) => {
      this.isFetching = false;
      this.totalHabits = data.totalElements;
      this.totalHabitsCopy = data.totalElements;
      this.totalPages = data.totalPages;
      this.currentPage = data.currentPage;
      this.habitsList = data.page;
      this.filteredHabitsList = data.page;

      if (data.page) {
        this.elementsLeft = data.totalElements !== this.habitsList.length;
        this.checkIfAssigned();
      }
    });

    this.masterSubscription.add(langChangeSub);
    this.masterSubscription.add(habitServiceSub);
  }

  private getAllHabitsTags(): void {
    this.tags.pipe(take(1)).subscribe((tagsArray: Array<TagInterface>) => (this.tagList = tagsArray));
  }

  public checkHabitsView(): void {
    const galleryView = this.localStorageService.getHabitsGalleryView();
    this.galleryView = galleryView ?? this.galleryView;
  }

  private fetchAllHabits(page, size): void {
    this.habitService
      .getAllHabits(page, size)
      .pipe<HabitListInterface>(map((data) => this.splitHabitItems(data)))
      .subscribe((data) => {
        const observableValue = this.allHabits.getValue();
        const oldItems = observableValue.page ? observableValue.page : [];
        data.page = [...oldItems, ...data.page];
        this.allHabits.next(data);
      });
  }

  public resetSubject() {
    this.allHabits.next([]);
  }

  private splitHabitItems(data) {
    data.page.forEach((el) => {
      const newArr = el.habitTranslation.habitItem.split(',').map((str) => str.trim().toLowerCase());
      el.habitTranslation.habitItem = newArr;
      return el.habitTranslation.habitItem;
    });

    return data;
  }

  ngOnDestroy(): void {
    this.masterSubscription.unsubscribe();
  }

  public onDisplayModeChange(mode: boolean): void {
    this.galleryView = mode;
    this.localStorageService.setHabitsGalleryView(mode);
  }

  public getFilterData(event: Array<string>): HabitInterface[] {
    if (!event.length) {
      this.totalHabitsCopy = this.totalHabits;
      this.filteredHabitsList = this.habitsList;
      this.currentPage = 1;
      return this.filteredHabitsList;
    }
    if (this.filteredHabitsList.length > 0) {
      this.filteredHabitsList = this.habitsList.filter((habit) => {
        return event.some((tag) => habit.tags.includes(tag));
      });
      this.totalHabitsCopy = this.filteredHabitsList.length;
      this.currentPage = this.totalPages;
      return this.filteredHabitsList;
    }
  }

  public onResize(): void {
    this.windowSize = window.innerWidth;
    this.galleryView = this.windowSize >= 576 ? this.galleryView : true;
  }

  public onScroll() {
    if (this.totalPages === this.currentPage) {
      this.isFetching = false;
      return;
    }
    this.isFetching = true;
    this.currentPage += 1;
    this.fetchAllHabits(this.currentPage, this.batchSize);
  }

  private resetState() {
    this.isFetching = true;
    this.currentPage = 0;
    this.elementsLeft = true;
  }

  public checkIfAssigned() {
    this.habitAssignService
      .getAssignedHabits()
      .pipe(take(1))
      .subscribe((response: Array<HabitAssignInterface>) => {
        response.forEach((assigned) => {
          this.filteredHabitsList.forEach((filtered) => {
            if (assigned.habit.id === filtered.id) {
              filtered.isAssigned = true;
            }
          });
        });
      });
  }
}
