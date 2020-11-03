import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-habits-gallery-view',
  templateUrl: './habits-gallery-view.component.html',
  styleUrls: ['./habits-gallery-view.component.scss']
})
export class HabitsGalleryViewComponent implements OnInit {
  @Input() habit;

  constructor() { }

  ngOnInit() {
    console.log(this.habit);
  }

  showId(value:string) {
    console.log(value);
  }

}
