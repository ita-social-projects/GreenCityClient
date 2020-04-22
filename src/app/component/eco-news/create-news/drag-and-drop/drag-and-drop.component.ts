import { Component, OnInit } from '@angular/core';
import { FileHandle } from '../create-news-interface';
import { CreateEcoNewsService } from '../../../../service/eco-news/create-eco-news.service';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent implements OnInit {

  constructor(private ecoNewsService: CreateEcoNewsService ) { }

  public files: FileHandle[] = [];
  public isWarning: boolean = false;

  public filesDropped(files: FileHandle[]): void {
    this.files = files;
    this.ecoNewsService.files = files;
    this.files.forEach(file => {
      if (file &&
        file.file.size < 10485760 && 
        (file.file.type === 'image/jpeg' || file.file.type === 'image/png')) {
        this.isWarning = false;
      } else {
        this.isWarning = true;
      }
    })
  }

  ngOnInit() {
  }
}

