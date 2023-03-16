import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ShoppingList } from '@global-user/models/shoppinglist.model';
import { HttpClient } from '@angular/common/http';
import { mainLink } from '../../../../../../links';
import { map } from 'rxjs/operators';
import { LanguageService } from 'src/app/main/i18n/language.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  constructor(private http: HttpClient, private languageService: LanguageService) {}

  public saveCustomItems(habitId: number, shopList: ShoppingList[]) {
    const customShoppingListItem: ShoppingList[] = shopList.filter((item) => item.custom);
    const userShoppingListItem: ShoppingList[] = shopList.filter((item) => !item.custom);
    const currentLang = this.languageService.getCurrentLanguage();

    return this.http.put<Array<ShoppingList>>(`${mainLink}habit/assign/${habitId}/allUserAndCustomList?lang=${currentLang}`, {
      customShoppingListItemDto: customShoppingListItem,
      userShoppingListItemDto: userShoppingListItem
    });
  }

  public getShoppingList(userId: number): Observable<ShoppingList[]> {
    return this.http.get<ShoppingList[]>(`${mainLink}user/shopping-list-items/${userId}/get-all-inprogress?lang=en`);
  }

  public getCustomShoppingList(userId: number): Observable<ShoppingList[]> {
    return this.http.get<ShoppingList[]>(`${mainLink}custom/shopping-list-items/${userId}/custom-shopping-list-items`);
  }

  public getHabitShoppingList(habitId: number): Observable<ShoppingList[]> {
    return this.http.get<ShoppingList[]>(`${mainLink}user/shopping-list-items/habits/${habitId}/shopping-list`);
  }

  public getHabitCustomShoppingList(userId: number, habitId: number): Observable<ShoppingList[]> {
    return this.http.get<ShoppingList[]>(`${mainLink}custom/shopping-list-items/${userId}/${habitId}`);
  }

  public updateStatusShopItem(item: ShoppingList): Observable<object[]> {
    const currentLang = this.languageService.getCurrentLanguage();
    const body = {};
    const newStatus = item.status === 'DONE' ? 'INPROGRESS' : 'DONE';
    return this.http.patch<object[]>(`${mainLink}user/shopping-list-items/${item.id}/status/${newStatus}?lang=${currentLang}`, body);
  }

  public updateStatusCustomShopItem(item: ShoppingList): Observable<object[]> {
    const currentLang = this.languageService.getCurrentLanguage();
    const body = {};
    const newStatus = item.status === 'DONE' ? 'INPROGRESS' : 'DONE';
    return this.http.patch<object[]>(`${mainLink}user/shopping-list-items/${item.id}/status/${newStatus}?lang=${currentLang}`, body);
  }
}
