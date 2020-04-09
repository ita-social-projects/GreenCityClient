import { Component, OnInit } from '@angular/core';
import { FileHandle } from '../../../../directives/drag-and-drop.directive';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent implements OnInit {

  constructor() { }

  

  files: FileHandle[] = [];

  filesDropped(files: FileHandle[]): void {
    this.files = files;
  }

  ngOnInit() {
  }

}
