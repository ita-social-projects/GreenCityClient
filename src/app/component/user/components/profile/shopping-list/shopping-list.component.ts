import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  public shoppingList: Array<string> = ['Шоппер', 'Еко чашка', 'Бамбукова щітка'];

  constructor() { }

  ngOnInit() {}

  public getShoppingList(): Array<string> {
    return this.shoppingList.slice(0, 3);
  }

}
