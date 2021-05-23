import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewChild, DoCheck } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { HttpClient } from '@angular/common/http';
import { MatDrawer } from '@angular/material';
import { AgmMarker } from '@agm/core';

import { markers, cards } from './Data.js';

import {
  redIcon,
  greenIcon,
  bookmark,
  bookmarkSaved,
  star,
  starHalf,
  starUnfilled,
  searchIcon,
  notification,
  share
} from '../../image-pathes/places-icons.js';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit, DoCheck {
  public lat = 49.84579567734425;
  public lng = 24.025124653312258;
  public zoom = 13;
  public cardsCollection: any;
  public tagList: Array<string> = [];
  public contentObj: any;
  public favoritePlaces: Array<number> = [];
  public stars: Array<string> = ['', '', '', '', ''];
  public markerList: Array<any> = [];
  public markerListCopy: Array<any> = [];
  public searchName = '';

  public searchIcon = searchIcon;
  public notification = notification;
  public share = share;

  @ViewChild('drawer', { static: false }) drawer: MatDrawer;

  constructor(private localStorageService: LocalStorageService, private translate: TranslateService, private http: HttpClient) {}

  ngOnInit() {
    this.tagList = ['Shops', 'Restaurants', 'Recycling points', 'Events', 'Saved places'];

    this.contentObj = {
      cardName: '',
      cardAddress: '',
      cardText: '',
      cardImgUrl: '',
      cardRating: 0,
      cardStars: []
    };

    this.cardsCollection = cards;
    this.markerList = markers;

    this.markerListCopy = this.markerList.slice();

    if (!sessionStorage.hasOwnProperty('favorites')) {
      this.favoritePlaces = [];
    } else {
      this.favoritePlaces = JSON.parse(sessionStorage.getItem('favorites'));
      this.markerList.forEach((item) => {
        if (this.favoritePlaces.includes(item.card.id)) {
          item.card.favorite = bookmarkSaved;
        }
      });
    }

    this.bindLang(this.localStorageService.getCurrentLanguage());
  }

  ngDoCheck(): void {
    this.startSearch();
  }

  public getFilterData(tags: Array<string>): void {
    if (tags.filter((item) => item === 'Saved places') && tags.length > 0) {
      if (!sessionStorage.hasOwnProperty('favorites')) {
        this.favoritePlaces = [];
      } else {
        this.favoritePlaces = JSON.parse(sessionStorage.getItem('favorites'));
      }
      this.markerListCopy = this.markerList.filter((item) => {
        return this.favoritePlaces.includes(item.card.id);
      });
    } else if (this.markerListCopy.length === 0) {
      this.markerListCopy = this.markerList.slice();
    }

    this.tagList = ['Shops', 'Restaurants', 'Recycling points', 'Events', 'Saved places'];
  }

  private bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }

  public getMarker(marker: AgmMarker): void {
    this.markerList.forEach((item) => {
      item.iconUrl = redIcon;
    });
    const clickedMarker = this.markerList.indexOf(
      this.markerList.filter((item) => {
        return item.lat === marker.latitude;
      })[0]
    );

    this.markerList[clickedMarker].iconUrl = greenIcon;
    this.contentObj = this.markerList[clickedMarker].card;
    this.contentObj.cardStars = this.getStars(this.contentObj.cardRating);
    this.drawer.toggle();
  }

  public moveToFavorite(event): void {
    const id = +event.toElement.parentNode.parentNode.id;

    if (!event.toElement.src.includes(bookmarkSaved)) {
      this.cardsCollection[id].favorite = bookmarkSaved;
      this.favoritePlaces.push(id);
      sessionStorage.setItem('favorites', JSON.stringify(this.favoritePlaces));
    } else {
      const indexToDelete = this.favoritePlaces.indexOf(id);
      this.cardsCollection[id].favorite = bookmark;
      this.favoritePlaces.splice(indexToDelete, 1);
      sessionStorage.setItem('favorites', JSON.stringify(this.favoritePlaces));
    }
  }

  public startSearch(): void {
    const searchParams = this.searchName.toLowerCase();
    this.markerListCopy = this.markerList.filter((item) => {
      return item.card.cardName.toLowerCase().includes(searchParams);
    });
  }

  private getStars(rating: number): Array<string> {
    const maxRating = 5;
    const halfOfStar = 0.5;

    if (rating > maxRating) {
      rating = maxRating;
    }

    let counter = 1;

    if (rating < halfOfStar) {
      this.stars.fill(starUnfilled);
      return this.stars;
    }

    if (rating >= halfOfStar && rating < 1) {
      this.stars.fill(starUnfilled);
      this.stars[0] = starHalf;
      return this.stars;
    }

    if (counter <= rating) {
      this.stars.fill(starUnfilled);

      while (counter <= rating) {
        this.stars[counter - 1] = star;
        counter++;
      }

      const checkHalf = counter - 1 + halfOfStar;

      if (checkHalf <= rating) {
        this.stars[counter - 1] = starHalf;
      }

      return this.stars;
    }
  }
}
