import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-images-slider',
  templateUrl: './images-slider.component.html',
  styleUrls: ['./images-slider.component.scss']
})
export class ImagesSliderComponent {
  @Input() images: string[];
  currentImageIdx = 0;

  selectImage(ind: number): void {
    this.currentImageIdx = ind;
  }

  moveRight(): void {
    this.currentImageIdx = this.currentImageIdx === this.images.length - 1 ? 0 : ++this.currentImageIdx;
  }

  moveLeft(): void {
    this.currentImageIdx = this.currentImageIdx === 0 ? this.images.length - 1 : --this.currentImageIdx;
  }
}
