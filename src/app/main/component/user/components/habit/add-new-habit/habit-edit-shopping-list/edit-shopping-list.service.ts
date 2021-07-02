import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ShoppingList } from '@global-user/models/shoppinglist.model';

@Injectable({
  providedIn: 'root'
})
export class EditShoppingListService {
  public list = [];
  public list$ = new Subject();

  public fillList(data: ShoppingList[]) {
    this.list = data;
    this.list$.next(this.list);
  }

  public getList(): Observable<any> {
    return this.list$.asObservable();
  }

  public addItem(value: string) {
    const newItem = {
      status: 'ACTIVE',
      text: value,
      selected: false
    };
    this.list = [newItem, ...this.list];
    this.list$.next(this.list);
  }

  public deleteItem(item) {
    this.list = this.list.filter((elem) => elem.text !== item.text);
    this.list$.next(this.list);
  }

  public select(item) {
    item.selected = !item.selected;
  }
}
