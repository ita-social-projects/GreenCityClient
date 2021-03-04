import { ProfileService } from './../profile-service/profile.service';
import { Component, OnInit } from '@angular/core';
import { ShoppingList } from '@global-user/models/shoppinglist.model';
import { Subscription } from 'rxjs';

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
        this.shoppingList = shoppingListArr;
      },
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

  private updateDataOnUi(item): any {
    const { status: prevItemStatus } = item;
    const newItemStatus = prevItemStatus === 'ACTIVE' ? 'DONE' : 'ACTIVE';
    return item.status = newItemStatus;
  }
}
