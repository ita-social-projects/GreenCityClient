import { Component, Input, ViewChild, ElementRef, Renderer2, AfterViewChecked } from '@angular/core';
import { EcoNewsModel } from 'src/app/component/eco-news/models/eco-news-model';
import { ecoNewsIcons } from 'src/assets/img/icon/econews/profile-icons';

@Component({
  selector: 'app-news-list-list-view',
  templateUrl: './news-list-list-view.component.html',
  styleUrls: ['./news-list-list-view.component.scss'],
  changeDetection: 0
})
export class NewsListListViewComponent implements AfterViewChecked {
  @Input() ecoNewsModel: EcoNewsModel;
  @ViewChild('titleHeight', { static: true }) titleHeight: ElementRef;
  @ViewChild('textHeight', { static: true }) textHeight: ElementRef;

  public profileIcons = ecoNewsIcons;
  public newsImage: string;
  public titleHeightOfElement: number;
  public textHeightOfElement: number;
  private quantityOfLines = {
    hiddenSize: 0,
    sSize: 28,
    smSize: 32,
    msSize: 52,
    mSize: 64,
    lSize: 96,
  };

  constructor(private renderer: Renderer2) { }

  ngAfterViewChecked() {
    this.checkHeightOfTittle();
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

  public calculateElementHeight(): number {
    const titleHeight = this.titleHeightOfElement;
    const linesQuantity = this.quantityOfLines;
    let elemHeight;

    if (titleHeight < linesQuantity.smSize) {
      elemHeight = linesQuantity.lSize;
    } else if (titleHeight > linesQuantity.smSize &&
      titleHeight <= linesQuantity.mSize) {
      elemHeight = linesQuantity.msSize;
    } else if (titleHeight > linesQuantity.mSize &&
      titleHeight <= linesQuantity.lSize) {
      elemHeight = linesQuantity.sSize;
    } else if (titleHeight > linesQuantity.lSize) {
      elemHeight = linesQuantity.hiddenSize;
    }
    return elemHeight;
  }

  public onResize(): void {
    this.checkHeightOfTittle();
  }
}
