import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FormBaseComponent } from 'src/app/shared/components/form-base/form-base.component';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import Quill from 'quill';
import 'quill-emoji/dist/quill-emoji.js';
import ImageResize from 'quill-image-resize-module';
import { HabitService } from '@shared/service/habit/habit.service';
import { TagInterface } from 'src/app/greencity/shared/components/tag-filter/tag-filter.model';
import { quillConfig } from 'src/app/shared/helpers/quillEditorFunc';
import { ToDoList } from 'src/app/greencity/modules/user/models/to-do-list.interface';
import { FileHandle } from 'src/app/shared/models/file-handle.model';
import { UserFriendsService } from 'src/app/greencity/modules/user/services/user-friends/user-friends.service';
import { TodoStatus } from '../models/todo-status.enum';
import {
  HABIT_COMPLEXITY_LIST,
  HABIT_DEFAULT_DURATION,
  HABIT_IMAGES,
  HABIT_TAGS_MAXLENGTH,
  STAR_IMAGES
} from '../add-new-habit/habit-const/habit.const';
import { ImageService } from '@shared/service/image/image.service';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';

@Component({
  selector: 'app-add-edit-custom-habit',
  templateUrl: './add-edit-custom-habit.component.html',
  styleUrls: ['./add-edit-custom-habit.component.scss']
})
export class AddEditCustomHabitComponent extends FormBaseComponent implements OnInit {
  habitForm: FormGroup;
  habit: any;
  complexityList = HABIT_COMPLEXITY_LIST;
  habitImages = HABIT_IMAGES;
  stars = STAR_IMAGES;
  initialDuration = HABIT_DEFAULT_DURATION;
  toDoList: ToDoList[] = [];
  newList: ToDoList[] = [];
  tagsList: TagInterface[];
  tagMaxLength = HABIT_TAGS_MAXLENGTH;
  selectedTagsList: number[];

  quillModules = {};
  isEditing = false;
  isValidDescription: boolean;
  previousPath: string;
  popupConfig = {
    hasBackdrop: true,
    closeOnNavigation: true,
    disableClose: true,
    panelClass: 'popup-dialog-container',
    data: {
      popupTitle: 'user.habit.all-habits.habits-popup.title',
      popupSubtitle: 'user.habit.all-habits.habits-popup.subtitle',
      popupConfirm: 'user.habit.all-habits.habits-popup.confirm',
      popupCancel: 'user.habit.all-habits.habits-popup.cancel'
    }
  };
  imageFile: FileHandle;
  private habitId: number;
  private userId: number;
  private currentLang: string;
  private destroyed$: Subject<boolean> = new Subject<boolean>();
  private editorText = '';

  constructor(
    public readonly dialog: MatDialog,
    public readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly localStorageService: LocalStorageService,
    private readonly translate: TranslateService,
    private readonly habitService: HabitService,
    private readonly userFriendsService: UserFriendsService,
    private readonly snackBar: MatSnackBarService,
    private readonly imageService: ImageService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    super(router, dialog);

    this.quillModules = quillConfig;
    Quill.register('modules/imageResize', ImageResize);
  }

  get durationControl() {
    return this.habitForm.get('duration');
  }

  ngOnInit(): void {
    this.getUserId();
    this.initForm();
    this.subscribeToLangChange();
    this.previousPath = `/profile/${this.userId}/allhabits`;
    this.userFriendsService.addedFriends.length = 0;
    this.isEditing = this.router.url?.includes('edit-habit');
    this.getHabitTags();

    if (this.isEditing) {
      this.initEditData();
    }
    this.imageFile = this.habitService.imageFile;
  }

  initEditData() {
    const habitId = +this.activatedRoute.snapshot.params.habitAssignId || +this.activatedRoute.snapshot.params.habitId;
    this.habitService
      .getHabitById(habitId)
      .pipe(take(1))
      .subscribe((habitState) => {
        this.habit = habitState;
        this.initialDuration = habitState.defaultDuration;
        this.setEditHabit();
        this.getHabitTags();
        this.imageService.createFileHandle(habitState.image, 'image/jpeg').subscribe((fileHandle: FileHandle) => {
          this.habitService.imageFile = fileHandle;
          this.imageFile = fileHandle;
        });
      });
    this.editorText = this.habitForm.get('description').value;
  }

  convertTagNamesToId(tagNames: string[]) {
    this.habitService.getAllTags().subscribe((tags) => {
      this.selectedTagsList = tags.filter((tag) => tagNames.includes(tag.nameEn)).map(({ id }) => id);
    });
  }

  changedEditor(event: EditorChangeContent | EditorChangeSelection): void {
    if (event.event !== 'selection-change') {
      this.editorText = event.text;
    }
    this.handleErrorClass('warning');
  }

  handleErrorClass(errorClassName: string): string {
    const descrControl = this.habitForm.get('description');
    this.isValidDescription = this.editorText.length > 20;
    this.isValidDescription ? descrControl.setErrors(null) : descrControl.setErrors({ invalidDescription: this.isValidDescription });
    return !this.isValidDescription ? errorClassName : '';
  }

  trimValue(control: AbstractControl): void {
    control.setValue(control.value.trim());
  }

  setComplexity(i: number): void {
    this.habitForm.patchValue({ complexity: i + 1 });
  }

  getStars(value: number, complexity: number): string {
    return value <= complexity ? this.stars.GREEN : this.stars.WHITE;
  }

  getToDoList(list: ToDoList[]): void {
    this.newList = list.map((item) => ({
      id: item.id,
      status: item.status,
      text: item.text
    }));
    this.habitForm.get('toDoList').setValue(this.newList);
  }

  getTagsList(list: TagInterface[]): void {
    this.selectedTagsList = list.map((el) => el.id);
    this.habitForm.get('tagIds').setValue(this.selectedTagsList);
  }

  getFile(image: FileHandle): void {
    this.habitService.imageFile = image;
  }

  goToAllHabits(): void {
    this.userFriendsService.addedFriends.length = 0;
    this.router.navigate([`/greenCity/profile/${this.userId}/allhabits`]);
    this.habitSuccessfullyAdded();
  }

  handleHabitDelete() {
    this.router.navigate([`/greenCity/profile/${this.userId}/allhabits`]);
    this.snackBar.openSnackBar('habitDeleted');
  }

  addHabit(): void {
    this.habitService
      .addCustomHabit(this.habitForm.value, this.currentLang)
      .pipe(take(1))
      .subscribe(() => {
        this.goToAllHabits();
      });
  }

  saveHabit(): void {
    this.habitService
      .changeCustomHabit(this.habitForm.value, this.currentLang, this.habitId)
      .pipe(take(1))
      .subscribe(() => {
        this.goToAllHabits();
      });
  }

  deleteHabit() {
    this.habitService
      .deleteCustomHabit(this.habitId)
      .pipe(take(1))
      .subscribe(() => this.handleHabitDelete());
  }

  private getUserId() {
    this.userId = this.localStorageService.getUserId();
  }

  private initForm(): void {
    this.habitForm = this.fb.group({
      title: new FormControl('', [Validators.required, Validators.maxLength(70)]),
      description: new FormControl('', [Validators.required, Validators.minLength(20), Validators.maxLength(63206)]),
      complexity: new FormControl(1, [Validators.required, Validators.max(3)]),
      duration: new FormControl(this.initialDuration, [Validators.required, Validators.min(7), Validators.max(56)]),
      tagIds: new FormControl([], Validators.required),
      image: new FormControl(''),
      toDoList: new FormControl([])
    });
  }

  private setEditHabit(): void {
    this.habitForm.addControl('id', new FormControl(null));
    this.habitForm.patchValue({
      title: this.habit.habitTranslation?.name,
      description: this.habit.habitTranslation.description,
      complexity: this.habit.complexity,
      duration: this.habit.defaultDuration,
      tagIds: this.habit.tags,
      image: this.habit.image,
      toDoList: this.habit.customToDoListItems
    });
    this.habitId = this.habit.id;
    this.toDoList = this.habit.customToDoListItems?.length
      ? [...(this.habit.customToDoListItems || [])]
      : [...(this.habit.customToDoListItems || []), ...this.habit.ToDoListItems];
    this.toDoList = this.toDoList.map((el) => ({ ...el, selected: el.status === TodoStatus.inprogress }));
  }

  private subscribeToLangChange(): void {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroyed$)).subscribe((lang) => {
      this.translate.setDefaultLang(lang);
      this.currentLang = lang;
    });
  }

  private habitSuccessfullyAdded(): void {
    if (this.isEditing) {
      this.snackBar.openSnackBar('habitUpdated');
    }
    if (this.habitForm.valid && this.isValidDescription) {
      this.snackBar.openSnackBar('habitAdded');
    }
  }

  private getHabitTags(): void {
    this.habitService
      .getAllTags()
      .pipe(take(1))
      .subscribe((tags: TagInterface[]) => {
        this.tagsList = tags;
        this.tagsList.forEach((tag) => (tag.isActive = this.habitForm.value.tagIds.some((el) => el === tag.nameEn || el === tag.nameUk)));
        if (this.isEditing) {
          const newList = this.tagsList.filter(
            (el) => this.habitForm.value.tagIds.includes(el.nameEn) || this.habitForm.value.tagIds.includes(el.nameUk)
          );
          this.getTagsList(newList);
        }
      });
  }
}
