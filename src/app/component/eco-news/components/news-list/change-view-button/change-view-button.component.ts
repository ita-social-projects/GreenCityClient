import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-change-view-button',
  templateUrl: './change-view-button.component.html',
  styleUrls: ['./change-view-button.component.css']
})
export class ChangeViewButtonComponent implements OnInit {
  @Output() view = new EventEmitter<boolean>();
  gallery = true;
  constructor() { }

  ngOnInit() {
    this.changeGalleryViewEmit(this.gallery);
  }

  private changeGalleryView(gallery: boolean): void {
    this.gallery = true;
    this.view.emit(this.gallery);
  }

  private changeGalleryViewEmit(gallery: boolean): void {
    this.view.emit(this.gallery);
  }

  private changeListView(list: boolean): void {
    this.gallery = false;
    this.view.emit(this.gallery);
  }
}
