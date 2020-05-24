import { Component, OnInit } from '@angular/core';
import { FileHandle } from '../create-news-interface';
import { CreateEcoNewsService } from '../../../../service/eco-news/create-eco-news.service';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent implements OnInit {

  constructor(private createEcoNewsService: CreateEcoNewsService ) { }

  public files: FileHandle[] = [];
  public isWarning: boolean = false;

  public filesDropped(files: FileHandle[]): void {
    this.files = files;
    this.createEcoNewsService.files = files;
    this.showWarning();
    this.createEcoNewsService.isImageValid = this.isWarning;
  }

  public showWarning(): void {
    this.files.forEach(item => {
      if (item &&
        item.file.size < 10485760 && 
        (item.file.type === 'image/jpeg' || item.file.type === 'image/png')) {
        this.isWarning = false;
      } else {
        this.isWarning = true;
      }
    })
  }

  ngOnInit() {
  }
}

