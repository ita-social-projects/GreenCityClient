import { Observable } from 'rxjs';
import { ProfileService } from './../profile-service/profile.service';
import { Component, OnInit } from '@angular/core';
import { ShoppingList } from '@global-user/models/shoppinglist.model';
import { toArray } from 'rxjs/operators';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  public shoppingList;
  public profileSubscription;
  public error = null;
  public shoppingListIsEMpty = true;

  constructor(private profileService: ProfileService) { }


  ngOnInit() {
    this.getShoppingList();
  }

  public getShoppingList(): void {
    this.profileSubscription = this.profileService.getShoppingList().subscribe(
      (success: ShoppingList[]) => {
        this.shoppingList = success;
        console.log(this.shoppingList);
      },
      (error) => this.error = error
    );
  }

  public toggleDone(item): void {
    this.profileService.toggleStatusOfShoppingItem(item)
      .subscribe(
        (success) => this.updateDataOnUi(item),
        (error) => console.log('error' + error)
      );
  }

  private updateDataOnUi(item): void {

    const index = this.shoppingList.findIndex(shoppingItem => shoppingItem.goalId === item.goalId);
    const newItemStatus = item.status === 'ACTIVE' ? 'DONE' : 'ACTIVE';

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
