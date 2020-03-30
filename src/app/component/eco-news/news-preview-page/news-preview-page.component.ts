import { Component, OnInit } from '@angular/core';
import { singleNewsImages } from '../../../../assets/img/icon/econews/single-news-images';

@Component({
  selector: 'app-news-preview-page',
  templateUrl: './news-preview-page.component.html',
  styleUrls: ['./news-preview-page.component.css']
})
export class NewsPreviewPageComponent implements OnInit {
  private images = singleNewsImages;

  constructor() { }

  ngOnInit() {
  }

}
