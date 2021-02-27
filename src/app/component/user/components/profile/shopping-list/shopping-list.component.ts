import { catchError } from 'rxjs/operators';
import { ProfileService } from './../profile-service/profile.service';
import { Component, OnInit } from '@angular/core';
import { ShoppingList } from '@global-user/models/shoppinglist.model';
import { Subscription, of } from 'rxjs';


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  public shoppingList: ShoppingList[];
  public profileSubscription: Subscription;
  public isLoading = true;
  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.getShoppingList();
  }

  public getShoppingList(): void {
    this.profileSubscription = this.profileService.getShoppingList()
    .subscribe(
      (shoppingListArr: ShoppingList[]) => {
        this.isLoading = false;
        this.shoppingList = shoppingListArr},
        error => {
          this.shoppingList = [];
          this.isLoading = false;
        }
    );
  }

  public toggleDone(item): void {
    this.profileService.toggleStatusOfShoppingItem(item)
      .subscribe((success) => this.updateDataOnUi(item));
  }

  private updateDataOnUi(item): void {

    const index = this.shoppingList.findIndex((shoppingItem: ShoppingList) => shoppingItem.goalId === item.goalId);
    const { status: prevItemStatus } = item;
    const newItemStatus = prevItemStatus === 'ACTIVE' ? 'DONE' : 'ACTIVE';

    const newItem = {
      ...item,
      status: newItemStatus
    };

    this.shoppingList = [
      ...this.shoppingList.slice(0, index),
      newItem,
      ...this.shoppingList.slice(index + 1)
    ];

  }
}
