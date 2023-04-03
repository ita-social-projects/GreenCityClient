import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-select-images',
  templateUrl: './select-images.component.html',
  styleUrls: ['./select-images.component.scss']
})
export class SelectImagesComponent {
  @Input() images: any;
}
