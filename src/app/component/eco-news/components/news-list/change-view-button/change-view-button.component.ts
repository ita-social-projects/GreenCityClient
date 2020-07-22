import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-change-view-button',
  templateUrl: './change-view-button.component.html',
  styleUrls: ['./change-view-button.component.scss']
})
export class ChangeViewButtonComponent implements OnInit {
  @Output() view = new EventEmitter<boolean>();
  public gallery = true;
  public windowSize: number;

  constructor() { }

  ngOnInit() {
    this.changeGalleryViewEmit(this.gallery);
    this.onResize();
  }

  public onResize(): void {
    this.windowSize = window.innerWidth;
    this.gallery = (this.windowSize > 576) ? this.gallery : true;

  }

  public changeGalleryView(gallery: boolean): void {
    this.gallery = true;
    this.view.emit(this.gallery);
  }

  public changeListView(list: boolean): void {
    this.gallery = false;
    this.view.emit(this.gallery);
  }

  private changeGalleryViewEmit(gallery: boolean): void {
    this.view.emit(this.gallery);

  }
}
