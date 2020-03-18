import { Component, OnInit, Input } from '@angular/core';
import { EcoNewsModel } from 'src/app/model/eco-news/eco-news-model';

@Component({
  selector: 'app-eco-news-detail',
  templateUrl: './eco-news-detail.component.html',
  styleUrls: ['./eco-news-detail.component.css']
})
export class EcoNewsDetailComponent implements OnInit {
  @Input() ecoNewsModel: EcoNewsModel;
  ecoNewsId: number;
  constructor() { }

  ngOnInit() {
  }
}
