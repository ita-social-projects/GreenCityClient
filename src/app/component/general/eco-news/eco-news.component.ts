import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-eco-news',
  templateUrl: './eco-news.component.html',
  styleUrls: ['./eco-news.component.css']
})
export class EcoNewsComponent implements OnInit {
  public getFilterArray: Array<string> = [];
  public actualDate = new Date();
  public actualYear = this.actualDate.getFullYear();

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Eco News');
  }

  getFilterData(value: Array<string>): void {
    this.getFilterArray = value;
  }
}
