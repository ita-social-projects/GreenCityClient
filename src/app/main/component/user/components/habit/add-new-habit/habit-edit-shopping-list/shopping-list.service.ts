import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AllShoppingLists, CustomShoppingItem, ShoppingList } from '@global-user/models/shoppinglist.model';
import { HttpClient } from '@angular/common/http';
import { mainLink } from '../../../../../../links';
import { LanguageService } from 'src/app/main/i18n/language.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  constructor(private http: HttpClient, private languageService: LanguageService) {}

  public getShopList(userId: number): Observable<ShoppingList[]> {
    return this.http.get<ShoppingList[]>(`${mainLink}user/shopping-list-items/${userId}/get-all-inprogress?lang=en`);
  }

  public getCustomShopList(userId: number): Observable<ShoppingList[]> {
    return this.http.get<ShoppingList[]>(`${mainLink}custom/shopping-list-items/${userId}/custom-shopping-list-items`);
  }

  public getHabitShopList(habitId: number): Observable<ShoppingList[]> {
    return this.http.get<ShoppingList[]>(`${mainLink}habit/${habitId}/shopping-list`);
  }

  public getHabitAllShopLists(habitId: number): Observable<AllShoppingLists> {
    const currentLang = this.languageService.getCurrentLanguage();
    return this.http.get<AllShoppingLists>(`${mainLink}habit/assign/${habitId}/allUserAndCustomList?lang=${currentLang}`);
  }

  public addHabitCustomShopList(userId: number, habitId: number, customShopList: CustomShoppingItem[]): Observable<ShoppingList[]> {
    const body = {
      customShoppingListItemSaveRequestDtoList: customShopList
    };
    return this.http.post<ShoppingList[]>(`${mainLink}custom/shopping-list-items/${userId}/${habitId}/custom-shopping-list-items`, body);
  }

  public updateStatusShopItem(item: ShoppingList): Observable<ShoppingList[]> {
    const currentLang = this.languageService.getCurrentLanguage();
    const body = {};
    return this.http.patch<ShoppingList[]>(
      `${mainLink}user/shopping-list-items/${item.id}/status/${item.status}?lang=${currentLang}`,
      body
    );
  }

  public updateStatusCustomShopItem(userId: number, item: ShoppingList): Observable<ShoppingList> {
    const body = {};
    return this.http.patch<ShoppingList>(
      `${mainLink}custom/shopping-list-items/${userId}/custom-shopping-list-items?itemId=${item.id}&status=${item.status}`,
      body
    );
  }

  public updateHabitShopList(habitId: number, customShopList: ShoppingList[], standartShopList: ShoppingList[]) {
    const currentLang = this.languageService.getCurrentLanguage();
    const body = {
      customShoppingListItemDto: customShopList,
      userShoppingListItemDto: standartShopList
    };
    return this.http.put(`${mainLink}habit/assign/${habitId}/allUserAndCustomList?lang=${currentLang}`, body);
  }
}
