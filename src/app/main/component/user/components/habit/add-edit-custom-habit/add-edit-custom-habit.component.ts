import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import Quill from 'quill';
import 'quill-emoji/dist/quill-emoji.js';
import { quillConfig } from './quillEditorFunc';
import ImageResize from 'quill-image-resize-module';
import { ShoppingList } from '@global-user/models/shoppinglist.model';
import { HabitAssignInterface } from 'src/app/main/interface/habit/habit-assign.interface';

@Component({
  selector: 'app-add-edit-custom-habit',
  templateUrl: './add-edit-custom-habit.component.html',
  styleUrls: ['./add-edit-custom-habit.component.scss']
})
export class AddEditCustomHabitComponent implements OnInit {
  public habitForm: FormGroup;
  public habit: any;
  public initialDuration = 7;
  public todoList: ShoppingList[];
  public newList: ShoppingList[] = [];

  public quillModules = {};
  private userId: number;
  private currentLang: string;

  private destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private localStorageService: LocalStorageService,
    private translate: TranslateService
  ) {
    this.quillModules = quillConfig;
    Quill.register('modules/imageResize', ImageResize);
  }

  ngOnInit(): void {
    this.getUserId();
    this.initForm();
    this.subscribeToLangChange();
    this.todoList = [];
  }

  private getUserId() {
    this.userId = this.localStorageService.getUserId();
  }

  private initForm(): void {
    this.habitForm = this.fb.group({
      title: new FormControl(null, [Validators.required, Validators.email]),
      description: new FormControl(null, [Validators.required, Validators.minLength(20), Validators.maxLength(63206)]),
      complexity: new FormControl(1, [Validators.required, Validators.max(3)]),
      duration: new FormControl(null, [Validators.required, Validators.min(7), Validators.max(56)]),
      tags: new FormControl(null, Validators.required)
    });
  }

  get description(): AbstractControl {
    return this.habitForm.get('description');
  }

  get duration(): AbstractControl {
    return this.habitForm.get('duration');
  }

  private subscribeToLangChange(): void {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroyed$)).subscribe((lang) => {
      this.translate.setDefaultLang(lang);
      this.currentLang = lang;
    });
  }

  public getDuration(newDuration: number): void {
    this.duration.setValue(newDuration);
  }

  public getList(list: ShoppingList[]): void {
    this.newList = list;
  }

  public goToAllHabits(): void {
    this.router.navigate([`/profile/${this.userId}/allhabits`]);
  }

  public addHabit(): void {}
}
