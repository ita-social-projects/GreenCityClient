import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import Quill from 'quill';
import 'quill-emoji/dist/quill-emoji.js';
import ImageResize from 'quill-image-resize-module';
import { HabitService } from '@global-service/habit/habit.service';
import { TagInterface } from '@shared/components/tag-filter/tag-filter.model';
import { quillConfig } from 'src/app/main/component/events/components/create-edit-events/quillEditorFunc';
import { ShoppingList } from '../../../models/shoppinglist.interface';
import { FileHandle } from '@eco-news-models/create-news-interface';

@Component({
  selector: 'app-add-edit-custom-habit',
  templateUrl: './add-edit-custom-habit.component.html',
  styleUrls: ['./add-edit-custom-habit.component.scss']
})
export class AddEditCustomHabitComponent implements OnInit {
  habitForm: FormGroup;
  habit: any;
  complexityList = [
    { value: 1, name: 'user.habit.add-new-habit.difficulty.easy', alt: 'Easy difficulty' },
    { value: 2, name: 'user.habit.add-new-habit.difficulty.medium', alt: 'Medium difficulty' },
    { value: 3, name: 'user.habit.add-new-habit.difficulty.hard', alt: 'Hard difficulty' }
  ];
  habitImages = [
    { src: 'assets/img/habits/habit-1.png', alt: 'Man with papers around on green background' },
    { src: 'assets/img/habits/habit-2.png', alt: 'Man with cup of cofee on green background' },
    { src: 'assets/img/habits/habit-3.png', alt: 'Woman on green background' }
  ];
  lineStar = 'assets/img/icon/star-2.png';
  greenStar = 'assets/img/icon/star-1.png';
  initialDuration = 7;
  shopList: ShoppingList[] = [];
  newList: ShoppingList[] = [];
  tagsList: TagInterface[];
  tagMaxLength = 3;
  selectedTagsList: number[];

  quillModules = {};
  isEditing = false;

  private userId: number;
  private currentLang: string;
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private localStorageService: LocalStorageService,
    private translate: TranslateService,
    private habitService: HabitService
  ) {
    this.quillModules = quillConfig;
    Quill.register('modules/imageResize', ImageResize);
  }

  ngOnInit(): void {
    this.getUserId();
    this.initForm();
    this.getHabitTags();
    this.subscribeToLangChange();
  }

  private getUserId() {
    this.userId = this.localStorageService.getUserId();
  }

  private initForm(): void {
    this.habitForm = this.fb.group({
      title: new FormControl('', [Validators.required, Validators.maxLength(70)]),
      description: new FormControl('', [Validators.required, Validators.minLength(20), Validators.maxLength(63206)]),
      complexity: new FormControl(1, [Validators.required, Validators.max(3)]),
      duration: new FormControl(null, [Validators.required, Validators.min(7), Validators.max(56)]),
      tagIds: new FormControl(null, Validators.required),
      image: new FormControl(''),
      shopList: new FormControl([])
    });
  }

  getControl(control: string): AbstractControl {
    return this.habitForm.get(control);
  }

  private subscribeToLangChange(): void {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroyed$)).subscribe((lang) => {
      this.translate.setDefaultLang(lang);
      this.currentLang = lang;
    });
  }

  getStars(value: number, complexity: number): string {
    return value <= complexity ? this.greenStar : this.lineStar;
  }

  getDuration(newDuration: number): void {
    this.getControl('duration').setValue(newDuration);
  }

  getShopList(list: ShoppingList[]): void {
    this.newList = list.map((item) => {
      return {
        id: item.id,
        status: item.status,
        text: item.text
      };
    });
    this.getControl('shopList').setValue(this.newList);
  }

  getTagsList(list: TagInterface[]): void {
    this.selectedTagsList = list.map((el) => el.id);
    this.getControl('tagIds').setValue(this.selectedTagsList);
  }

  getFile(image: FileHandle[]): void {
    this.getControl('image').setValue(image[0].file);
  }

  goToAllHabits(): void {
    this.router.navigate([`/profile/${this.userId}/allhabits`]);
  }

  private getHabitTags(): void {
    this.habitService
      .getAllTags()
      .pipe(take(1))
      .subscribe((tags: TagInterface[]) => {
        this.tagsList = tags;
        this.tagsList.forEach((item) => (item.isActive = false));
      });
  }

  addHabit(): void {
    this.habitService
      .addCustomHabit(this.habitForm.value, this.currentLang)
      .pipe(take(1))
      .subscribe(() => {
        this.goToAllHabits();
      });
  }
}
