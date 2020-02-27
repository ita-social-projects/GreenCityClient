import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-change-view-button',
  templateUrl: './change-view-button.component.html',
  styleUrls: ['./change-view-button.component.css']
})
export class ChangeViewButtonComponent implements OnInit {
  @Output() view = new EventEmitter<boolean>();
  gallery: boolean = true;
  constructor() {}

  ngOnInit() {
    this.changeGalleryViewEmit(this.gallery);
  }

  changeGalleryView(gallery: boolean) {
    this.gallery = true;
    this.view.emit(this.gallery);
  }
  changeGalleryViewEmit(gallery: boolean) {
    this.view.emit(this.gallery);
  }
  changeListView(list: boolean) {
    this.gallery = false;
    this.view.emit(this.gallery);
  }
}
