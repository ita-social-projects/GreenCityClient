import {Component, OnInit, Input, ViewChild, ElementRef, Renderer2, AfterViewChecked } from '@angular/core';
import { EcoNewsModel } from 'src/app/model/eco-news/eco-news-model';
import { ecoNewsIcons } from 'src/assets/img/icon/econews/profile-icons';

@Component({
  selector: 'app-news-list-list-view',
  templateUrl: './news-list-list-view.component.html',
  styleUrls: ['./news-list-list-view.component.css'],
  changeDetection: 0
})
export class NewsListListViewComponent implements OnInit, AfterViewChecked {
  @Input() ecoNewsModel: EcoNewsModel;
  @ViewChild('titleHeight', { static: true }) titleHeight: ElementRef;
  @ViewChild('textHeight', { static: true }) textHeight: ElementRef;

  profileIcons = ecoNewsIcons;
  private newsText: string;
  private newsImage: string;
  private titleHeightOfElement: number;
  private textHeightOfElement: number;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.textValidationOfMinCharacters();
  }

  private textValidationOfMinCharacters(): string {
    return this.newsText = (this.ecoNewsModel.text.length >= 198) ?
      ((this.ecoNewsModel.text).slice(0, 197) + '...') : (this.ecoNewsModel.text);
  }

  private checkNewsImage(): string {
    return this.newsImage = (this.ecoNewsModel.imagePath && this.ecoNewsModel.imagePath !== ' ') ?
      this.ecoNewsModel.imagePath : this.profileIcons.newsDefaultPictureList;
  }

  private checkHeightOfTittle(): void {
    this.titleHeightOfElement = this.titleHeight.nativeElement.offsetHeight;
    switch (true) {
      case (this.titleHeightOfElement < 32):
        this.textHeightOfElement = 96;
        break;
      case (this.titleHeightOfElement > 32 && this.titleHeightOfElement <= 64):
        this.textHeightOfElement = 52;
        break;
      case (this.titleHeightOfElement > 64):
        this.textHeightOfElement = 28;
        break;
    }
    this.renderer.setStyle(this.textHeight.nativeElement, 'height', this.textHeightOfElement + 'px' );
  }

  private onResize(): void {
    this.checkHeightOfTittle();
  }

  ngAfterViewChecked() {
    this.checkHeightOfTittle();
  }
}
