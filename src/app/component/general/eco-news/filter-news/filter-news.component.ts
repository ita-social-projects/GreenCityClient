import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter-news',
  templateUrl: './filter-news.component.html',
  styleUrls: ['./filter-news.component.css']
  
})

export class FilterNewsComponent implements OnInit {

  @Output() gridOutput = new EventEmitter<Array<string>>();

  private emitter():void {
    this.gridOutput.emit(this.emitTrueFilterValues());
  }

  private emitTrueFilterValues() :Array<string> {
      let trueFilterValuesArray = [];

      for(let i in this.styleGrid){
        if (this.styleGrid[i] === true){
          trueFilterValuesArray.push(i);
        }
      }
    return trueFilterValuesArray;
  }

  styleGrid = {
    news: false,
    events: false,
    courses: false,
    initiatives: false,
    ads: false
  }

  newsClick() {
    this.styleGrid.news = true;
    this.emitter();
  }

  newsClickClose(event){
    this.styleGrid.news = false;
    event.stopPropagation();
    this.emitter();
  }

  eventsClick() {
    this.styleGrid.events = true;
    this.emitter();
  }

  eventsClickClose(event){
    this.styleGrid.events = false;
    event.stopPropagation();
    this.emitter();
  }

  coursesClick() {
    this.styleGrid.courses = true;
    this.emitter();
  }

  coursesClickClose(event){
    this.styleGrid.courses = false;
    event.stopPropagation();
    this.emitter();
  }

  initiativesClick() {
    this.styleGrid.initiatives = true;
    this.emitter();
  }

  initiativesClickClose(event){
    this.styleGrid.initiatives = false;
    event.stopPropagation();
    this.emitter();
  }

  adsClick() {
    this.styleGrid.ads = true;
    this.emitter();
  }

  adsClickClose(event){
    this.styleGrid.ads = false;
    event.stopPropagation();
    this.emitter();
  }

  constructor() { }

  ngOnInit() {
    this.emitter();
  }

}