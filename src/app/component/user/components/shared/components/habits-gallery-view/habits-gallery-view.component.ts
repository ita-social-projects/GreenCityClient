import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-habits-gallery-view',
  templateUrl: './habits-gallery-view.component.html',
  styleUrls: ['./habits-gallery-view.component.scss']
})
export class HabitsGalleryViewComponent {
  @Input() habit;

  constructor() { }

  ngOnInit() { }

}
