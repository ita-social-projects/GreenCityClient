import { ProfileService } from './../profile-service/profile.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  private shoppingList = [];
  public profileSubscription;

  constructor(private profileService: ProfileService) { }


 ngOnInit() {
   this.profileSubscription = this.profileService.getShoppingList().subscribe(
     (success: any[]) => {
      this.shoppingList = success;
      console.log(this.shoppingList);
     }
   );
 }

  private isItemChecked(item): boolean {
    return item.status === 'DONE';
  }

  private changeValue(item): void {
    const index = this.shoppingList.findIndex(shoppingItem => shoppingItem.id === item.id);
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
