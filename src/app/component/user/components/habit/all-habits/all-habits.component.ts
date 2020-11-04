import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from './../../../../../service/localstorage/local-storage.service';
import { ServerHabitItemModel, ServerHabitItemPageModel } from './../../../models/habit-item.model';
import { Subscription } from 'rxjs';
import { AllHabitsService } from './services/all-habits.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-all-habits',
  templateUrl: './all-habits.component.html',
  styleUrls: ['./all-habits.component.scss']
})
export class AllHabitsComponent implements OnInit, OnDestroy {
  private masterSubscription: Subscription = new Subscription();
  private habitsList: ServerHabitItemPageModel[] = [];
  public filteredHabitsList: ServerHabitItemPageModel[] = [];
  public totalHabits: number;
  public totalHabitsCopy = 0;
  public galleryView = true;
  private lang: string;
  public windowSize: number;
  private batchSize = 6;
  private currentPage = 0;
  private totalPages: number;
  public isFetching = true;
  public elementsLeft = true;
  public tagList: string[] = [];

  constructor( private allHabitsService: AllHabitsService,
               private localStorageService: LocalStorageService,
               private translate: TranslateService ) { }

  ngOnInit() {
    this.onResize();

    const langChangeSub = this.localStorageService.languageBehaviourSubject.subscribe(lang => {
      this.translate.setDefaultLang(lang);
      this.isFetching = true;
      this.elementsLeft = true;
      this.lang = lang;
      if (this.lang) {
        this.allHabitsService.resetSubject();
      }
      this.getAllHabits(0, this.batchSize, lang);
    });

    const habitServeceSub = this.allHabitsService.allHabits.subscribe(data => {
      this.isFetching = false;
      this.totalHabits = data.totalElements;
      this.totalHabitsCopy = data.totalElements;
      this.totalPages = data.totalPages;
      this.currentPage = data.currentPage;
      this.habitsList = data.page;
      this.filteredHabitsList = data.page;

      const tag = [];
      if (data.page) {
        data.page.forEach(element => {
          tag.push(element.habitTranslation.habitItem);
        });
        this.tagList = [...new Set(tag)];
      }
    });

    this.masterSubscription.add(langChangeSub);
    this.masterSubscription.add(habitServeceSub);
  }

  onDisplayModeChange(mode: boolean): void {
    this.galleryView = mode;
  }

  private getAllHabits(page: number, size: number, lang: string): void {
    this.allHabitsService.fetchAllHabits(page, size, lang);
  }

  getFilterData(event: Array<string>) {
    if (event.length === 0) {
      this.totalHabitsCopy = this.totalHabits;
      return this.filteredHabitsList = this.habitsList;
    }
    if (this.filteredHabitsList) {
      this.filteredHabitsList = this.habitsList.filter(el => event.includes(el.habitTranslation.habitItem));
      this.totalHabitsCopy = this.filteredHabitsList.length;
    }
  }

  public onResize(): void {
    this.windowSize = window.innerWidth;
    this.galleryView = (this.windowSize >= 576) ? this.galleryView : true;
  }

  ngOnDestroy(): void {
    this.masterSubscription.unsubscribe();
  }

  onScroll() {
    this.isFetching = true;
    if (this.totalPages === this.currentPage) {
      this.elementsLeft = false;
      this.isFetching = false;
      return;
    }
    this.currentPage += 1;
    this.getAllHabits(this.currentPage, this.batchSize, this.lang);
  }
}
