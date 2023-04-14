import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { mainLink } from '../../../../../../links';
import { AllShoppingLists, CustomShoppingItem, HabitUpdateShopList, ShoppingList } from '../../models/shoppinglist.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  constructor(private http: HttpClient) {}

  public getHabitShopList(habitId: number): Observable<ShoppingList[]> {
    return this.http.get<ShoppingList[]>(`${mainLink}habit/${habitId}/shopping-list`);
  }

  public getHabitAllShopLists(habitAssignId: number, lang: string): Observable<AllShoppingLists> {
    return this.http.get<AllShoppingLists>(`${mainLink}habit/assign/${habitAssignId}/allUserAndCustomList?lang=${lang}`);
  }

  public getUserShoppingLists(lang: string): Observable<AllShoppingLists[]> {
    return this.http.get<AllShoppingLists[]>(`${mainLink}habit/assign/allUserAndCustomShoppingListsInprogress?lang=${lang}`);
  }

  public addHabitCustomShopList(userId: number, habitId: number, customShopList: CustomShoppingItem[]): Observable<ShoppingList[]> {
    const body = {
      customShoppingListItemSaveRequestDtoList: customShopList
    };
    return this.http.post<ShoppingList[]>(`${mainLink}custom/shopping-list-items/${userId}/${habitId}/custom-shopping-list-items`, body);
  }

  public updateStandardShopItemStatus(item: ShoppingList, lang: string): Observable<ShoppingList[]> {
    const body = {};
    return this.http.patch<ShoppingList[]>(`${mainLink}user/shopping-list-items/${item.id}/status/${item.status}?lang=${lang}`, body);
  }

  public updateCustomShopItemStatus(userId: number, item: ShoppingList): Observable<ShoppingList> {
    const body = {};
    return this.http.patch<ShoppingList>(
      `${mainLink}custom/shopping-list-items/${userId}/custom-shopping-list-items?itemId=${item.id}&status=${item.status}`,
      body
    );
  }

  public updateHabitShopList(habitShopList: HabitUpdateShopList) {
    const assignId = habitShopList.habitAssignId;
    const body = {
      customShoppingListItemDto: habitShopList.customShopList,
      userShoppingListItemDto: habitShopList.standartShopList
    };
    return this.http.put(`${mainLink}habit/assign/${assignId}/allUserAndCustomList?lang=${habitShopList.lang}`, body);
  }
}
