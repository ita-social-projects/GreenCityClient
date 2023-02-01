import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ShoppingList } from '@global-user/models/shoppinglist.model';
import { HttpClient } from '@angular/common/http';
import { mainLink } from '../../../../../../links';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  public list = [];
  public list$ = new Subject();

  private customList = [];

  constructor(private http: HttpClient) {}

  public fillList(data: ShoppingList[]) {
    this.list = data;
    this.placeItemInOrder();
    console.log('we are in the fillList method and this.list: ', this.list);
    this.list$.next(this.list);
  }

  public getList(): Observable<any> {
    return this.list$.asObservable();
  }

  public addItem(value: string) {
    const newItem = {
      id: -1,
      status: 'ACTIVE',
      text: value,
      selected: false,
      custom: true
    };
    this.list = [newItem, ...this.list];
    this.placeItemInOrder();
    this.customList.push(newItem);
    this.list$.next(this.list);
  }

  public deleteItem(item) {
    this.list = this.list.filter((elem) => elem.text !== item.text);
    this.customList = this.customList.filter((elem) => elem.text !== item.text);
    this.list$.next(this.list);
  }

  placeItemInOrder(): void {
    const trueList = this.list.filter((element) => element.selected);
    const falseList = this.list.filter((element) => !element.selected);
    this.list = [...trueList, ...falseList];
  }

  public select(item: ShoppingList) {
    this.list = this.list.map((element) => {
      if (element.text === item.text) {
        element.selected = !item.selected;
      }
      return element;
    });
    if (item.selected) {
      const index = this.list.indexOf(item);
      this.list.splice(index, 1);
      this.list = [item, ...this.list];
    }
    this.placeItemInOrder();
    this.list$.next(this.list);
  }

  public saveCustomItems(userId: string, habitId: number) {
    return this.http.post<Array<ShoppingList>>(`${mainLink}custom/shopping-list-items/${userId}/${habitId}/custom-shopping-list-items`, {
      customShoppingListItemSaveRequestDtoList: this.customList
    });
  }

  public getCustomItems(habitId: number) {
    this.http
      .get(`${mainLink}habit/assign/allUserAndCustomList/${habitId}`)
      .pipe(
        map((res: any) => {
          let customShoppingList = res.customShoppingListItemDto.map((item) => ({
            ...item,
            custom: true,
            selected: item.status === 'INPROGRESS'
          }));
          let userShoppingList = res.userShoppingListItemDto.map((item) => ({
            ...item,
            selected: item.status === 'INPROGRESS'
          }));

          return [...customShoppingList, ...userShoppingList];
        })
      )
      .subscribe((res: ShoppingList[]) => {
        this.fillList(res);
      });
  }
}
