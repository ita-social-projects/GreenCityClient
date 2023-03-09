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
  public list = [];
  public list$ = new Subject();

  private customList = [];

  constructor(private http: HttpClient, private languageService: LanguageService) {}

  public fillList(data: ShoppingList[]) {
    this.list = data;
    this.placeItemInOrder();
    this.list$.next(this.list);
  }

  public getList(): Observable<any> {
    return this.list$.asObservable();
  }

  public addItem(value: string) {
    const newItem = {
      id: null,
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
        element.status = item.selected ? 'INPROGRESS' : 'ACTIVE';
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
  public saveCustomItems(habitId: number) {
    const customShoppingListItem: ShoppingList[] = this.list.filter((item) => item.custom);
    const userShoppingListItem: ShoppingList[] = this.list.filter((item) => !item.custom);
    const currentLang = this.languageService.getCurrentLanguage();

    return this.http.put<Array<ShoppingList>>(`${mainLink}habit/assign/${habitId}/allUserAndCustomList?lang=${currentLang}`, {
      customShoppingListItemDto: customShoppingListItem,
      userShoppingListItemDto: userShoppingListItem
    });
  }

  public getCustomItems(habitId: number) {
    const currentLang = this.languageService.getCurrentLanguage();
    this.http
      .get(`${mainLink}habit/assign/${habitId}/allUserAndCustomList?lang=${currentLang}`)
      .pipe(
        map((res: any) => {
          const customShoppingList = res.customShoppingListItemDto.map((item) => ({
            ...item,
            custom: true,
            selected: item.status === 'INPROGRESS'
          }));
          const userShoppingList = res.userShoppingListItemDto.map((item) => ({
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
