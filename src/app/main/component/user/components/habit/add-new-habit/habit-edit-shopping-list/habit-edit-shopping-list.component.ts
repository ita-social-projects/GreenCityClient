import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ShoppingList } from '@global-user/models/shoppinglist.model';
import { EditShoppingListService } from './edit-shopping-list.service';
import { ActivatedRoute } from '@angular/router';
import { HabitService } from '@global-service/habit/habit.service';
import { take } from 'rxjs/operators';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { HabitAssignInterface } from 'src/app/main/interface/habit/habit-assign.interface';
@Component({
  selector: 'app-habit-edit-shopping-list',
  templateUrl: './habit-edit-shopping-list.component.html',
  styleUrls: ['./habit-edit-shopping-list.component.scss']
})
export class HabitEditShoppingListComponent implements OnInit, OnDestroy {
  public itemForm = new FormGroup({
    item: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(18)])
  });
  public list: ShoppingList[] = [];
  public subscription: Subscription;
  public habitId: number;
  @Output() newList = new EventEmitter<ShoppingList[]>();
  @Input() habitShoppingListIniteal: ShoppingList[];

  constructor(
    public shoppinglistService: EditShoppingListService,
    private route: ActivatedRoute,
    private habitService: HabitService,
    private habitAssignService: HabitAssignService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.habitId = +params.habitId;
    });
    this.checkIfAssigned();
    this.subscription = this.shoppinglistService.getList().subscribe((data) => {
      this.list = data;
      this.newList.emit(this.list);
    });
  }

  getListItems(isAssigned: boolean) {
    isAssigned ? this.getCustomItems() : this.getDefaultItems();
  }

  public getDefaultItems() {
    this.habitService
      .getHabitById(this.habitId)
      .pipe(take(1))
      .subscribe((habit) => {
        this.shoppinglistService.fillList(habit.shoppingListItems);
      });
  }

  public getCustomItems() {
    this.habitAssignService
      .getCustomHabit(this.habitId)
      .pipe(take(1))
      .subscribe((habit) => {
        this.shoppinglistService.fillList(habit.shoppingListItems);
      });
  }

  public checkIfAssigned() {
    this.habitAssignService
      .getAssignedHabits()
      .pipe(take(1))
      .subscribe((response: Array<HabitAssignInterface>) => {
        if (response.length === 0 || response === undefined) {
          this.getListItems(false);
        } else {
          response.find((assigned) => {
            if (assigned.habit.id === this.habitId) {
              this.getListItems(true);
            } else {
              this.getListItems(false);
            }
          });
        }
      });
  }

  public add(value: string) {
    this.shoppinglistService.addItem(value);
  }

  public delete(item) {
    this.shoppinglistService.deleteItem(item);
  }

  public select(item) {
    this.shoppinglistService.select(item);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
