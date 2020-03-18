import { Component, OnInit, Input } from '@angular/core';
import { ecoNewsIcons } from 'src/assets/img/icon/econews/profile-icons';
import { EcoNewsService } from 'src/app/service/eco-news/eco-news.service';
import { EcoNewsModel } from 'src/app/model/eco-news/eco-news-model';

@Component({
  selector: 'app-eco-news-widget',
  templateUrl: './eco-news-widget.component.html',
  styleUrls: ['./eco-news-widget.component.css']
})
export class EcoNewsWidgetComponent implements OnInit {
  @Input() ecoNewsModel: EcoNewsModel;
  profileIcons = ecoNewsIcons;
  defaultPicture = ecoNewsIcons;
  separetedNews: EcoNewsModel[];

  constructor(private ecoNewsService: EcoNewsService) { }

  ngOnInit() {
    this.ecoNewsService
      .getAllEcoNews()
      .subscribe(this.setSortedElement.bind(this));
  }
  private setSortedElement(data: EcoNewsModel[]) {
    this.separetedNews = [...data]
      .sort((a: any, b: any) => {
        const dateA: any = new Date(a.creationDate);
        const dateB: any = new Date(b.creationDate);
        return dateB - dateA;
      })
      .splice(0, 3);
  }
}
