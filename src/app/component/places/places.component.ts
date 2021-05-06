import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit {
  public lat = 49.841795;
  public lng = 24.031706;
  public zoom = 13;
  public cardsCollection: Array<Object>;
  public tagList: Array<string> = [];

  constructor(private localStorageService: LocalStorageService, private translate: TranslateService) {}

  ngOnInit() {
    this.tagList = ['Shops', 'Restaurants', 'Recycling points', 'Events', 'Saved places'];
    this.cardsCollection = [0, 0, 0, 0];
    this.cardsCollection.fill({
      cardName: 'Place name',
      cardAddress: 'Address Street, №123',
      cardText: 'Service description, service description',
      cardImgUrl: 'assets/img/eco-place.png'
    });
    this.bindLang(this.localStorageService.getCurrentLanguage());
  }

  public getFilterData(value: Array<string>): void {
    this.tagList = ['Shops', 'Restaurants', 'Recycling points', 'Events', 'Saved places'];
  }

  private bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }
}
