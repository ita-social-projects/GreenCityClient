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
    this.getSessionStorageView();
    this.changeGalleryViewEmit(this.gallery);
    this.onResize();
  }

  public onResize(): void {
    this.windowSize = window.innerWidth;
    this.gallery = (this.windowSize >= 576) ? this.gallery : true;
  }

  public changeGalleryView(gallery: boolean): void {
    this.gallery = true;
    this.view.emit(this.gallery);
    this.setSessionStorageView();
  }

  public changeListView(list: boolean): void {
    this.gallery = false;
    this.view.emit(this.gallery);
    this.setSessionStorageView();
  }

  private changeGalleryViewEmit(gallery: boolean): void {
    this.view.emit(gallery);
  }

  private setSessionStorageView() {
    sessionStorage.setItem('viewGallery', JSON.stringify(this.gallery));
  }

  private getSessionStorageView() {
    const view = sessionStorage.getItem('viewGallery');
    if (view !== null) {
      this.gallery = JSON.parse(view);
      this.view.emit(this.gallery);
    }
  }
}
