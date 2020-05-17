import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2, AfterViewChecked } from '@angular/core';
import { EcoNewsModel } from 'src/app/model/eco-news/eco-news-model';
import { ecoNewsIcons } from 'src/assets/img/icon/econews/profile-icons';

@Component({
  selector: 'app-news-list-list-view',
  templateUrl: './news-list-list-view.component.html',
  styleUrls: ['./news-list-list-view.component.scss'],
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
  private quantityOfLines = {
    hiddenSize: 0,
    sSize: 28,
    smSize: 32,
    msSize: 52,
    mSize: 64,
    lSize: 96,
  };

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
    this.textHeightOfElement = this.calculateElementHeight();
    this.renderer.setStyle(this.textHeight.nativeElement,
                      'height',
                          this.textHeightOfElement + 'px' );
  }

  private calculateElementHeight(): number {
    const titleHeight = this.titleHeightOfElement;
    const linesQuantity = this.quantityOfLines;
    let elemHeight;

    if (titleHeight < linesQuantity.smSize) {
      elemHeight = linesQuantity.lSize;
    } else if (titleHeight > linesQuantity.lSize) {
      elemHeight = linesQuantity.hiddenSize;
    } else if (titleHeight > linesQuantity.smSize &&
      titleHeight <= linesQuantity.mSize) {
      elemHeight = linesQuantity.msSize;
    } else if (titleHeight > linesQuantity.mSize &&
      titleHeight <= linesQuantity.lSize) {
      elemHeight = linesQuantity.sSize;
    }

    return elemHeight;
  }

  private onResize(): void {
    this.checkHeightOfTittle();
  }

  ngAfterViewChecked() {
    this.checkHeightOfTittle();
  }
}
