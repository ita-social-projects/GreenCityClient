import { ProfileService } from './../profile-service/profile.service';
import { Component, OnInit } from '@angular/core';
import { ShoppingList } from '@global-user/models/shoppinglist.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  private shoppingList = [];
  public profileSubscription;
  public error = null;

  constructor(private profileService: ProfileService) { }


  ngOnInit() {
    this.profileSubscription = this.profileService.getShoppingList().subscribe(
      (success: ShoppingList[]) => {
        this.shoppingList = success;
      },
      (error) => {
        this.error = error;
      }
    );
  }
}
