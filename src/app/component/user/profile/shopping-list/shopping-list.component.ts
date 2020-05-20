import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  shoppingList = ["Шоппер", "Еко чашка", "Бамбукова щітка"];

  showShoppingList = this.shoppingList.slice(0, 3);

  constructor() { }

  ngOnInit() {
  }

}
