import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-news-list-gallery-view',
  templateUrl: './news-list-gallery-view.component.html',
  styleUrls: ['./news-list-gallery-view.component.css']
})
export class NewsListGalleryViewComponent implements OnInit {
  changedTitleLength: string;
  changedTextLength: string;
  date: Date;
  @Input() id: string;
  @Input() imagePath: string;
  @Input() title: string;
  @Input() text: string;
  @Input() name: string;
  @Input() tag: string;
  @Input() creationDate: number;

  constructor() {}

  ngOnInit() {
    this.changeLength(this.title, this.text);
  }
  changeLength(title: string, text: string) {
    if (title.length > 170) {
      this.changedTitleLength = title.slice(0, 170);
      console.log(this.changedTitleLength.length);
    }
    if (text.length > 200) {
      this.changedTextLength = text.slice(0, 200);
      console.log(this.changedTextLength.length);
    }
  }
}
