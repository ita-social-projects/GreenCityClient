import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-post-news-loader',
  templateUrl: './post-news-loader.component.html',
  styleUrls: ['./post-news-loader.component.css']
})

export class PostNewsLoaderComponent implements OnInit {
  public actualYear = new Date().getFullYear();
  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('About');
  }
}


