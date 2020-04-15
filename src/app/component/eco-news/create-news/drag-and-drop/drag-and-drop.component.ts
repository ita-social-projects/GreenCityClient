import { Component, OnInit } from '@angular/core';
import { FileHandle } from '../create-news-interface';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent implements OnInit {

  constructor() { }

  public files: FileHandle[] = [];

  public filesDropped(files: FileHandle[]): void {
    this.files = files;
  }

  ngOnInit() {
  }

}
