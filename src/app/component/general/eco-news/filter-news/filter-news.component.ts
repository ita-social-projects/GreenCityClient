import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-news',
  templateUrl: './filter-news.component.html',
  styleUrls: ['./filter-news.component.css']
  
})

export class FilterNewsComponent implements OnInit {

  styleGrid = {
    news: true,
    events: false,
    courses: false,
    initiatives: false,
    ads: false
  }

  newsClick() {
    this.styleGrid.news = true;
  }

  newsClickClose(event){
    this.styleGrid.news = false;
    event.stopPropagation();
  }

  eventsClick() {
    this.styleGrid.events = true;
  }

  eventsClickClose(event){
    this.styleGrid.events = false;
    event.stopPropagation();
  }

  coursesClick() {
    this.styleGrid.courses = true;
  }

  coursesClickClose(event){
    this.styleGrid.courses = false;
    event.stopPropagation();
  }

  initiativesClick() {
    this.styleGrid.initiatives = true;
  }

  initiativesClickClose(event){
    this.styleGrid.initiatives = false;
    event.stopPropagation();
  }

  adsClick() {
    this.styleGrid.ads = true;
  }

  adsClickClose(event){
    this.styleGrid.ads = false;
    event.stopPropagation();
  }

  constructor() { }

  ngOnInit() {
    
  }

}