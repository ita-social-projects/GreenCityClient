import { Component, OnInit } from '@angular/core';
import { preparedImageForCreateEcoNews } from '../../../links';


@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.css']
})
export class CreateNewsComponent implements OnInit {

  link: string = preparedImageForCreateEcoNews;

  constructor() { }

  ngOnInit() {
  }

}
