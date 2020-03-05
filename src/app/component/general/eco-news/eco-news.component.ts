import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-eco-news',
  templateUrl: './eco-news.component.html',
  styleUrls: ['./eco-news.component.css']
})
export class EcoNewsComponent implements OnInit {
  public getFilterArray: Array<string> = [];

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Eco News');
  }

  private getFilterData(value: Array<string>): void {
    this.getFilterArray = value;
  }
}
