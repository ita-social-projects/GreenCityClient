import { Component, Input, ViewChild, ElementRef, Renderer2, AfterViewChecked } from '@angular/core';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { ecoNewsIcons } from 'src/app/image-pathes/profile-icons';

import { possibleDescHeigth, possibleTitleHeigth } from './breakpoints';

@Component({
  selector: 'app-news-list-list-view',
  templateUrl: './news-list-list-view.component.html',
  styleUrls: ['./news-list-list-view.component.scss'],
  changeDetection: 0
})
export class NewsListListViewComponent implements AfterViewChecked {
  @Input() ecoNewsModel: EcoNewsModel;
  @ViewChild('titleHeight', {static: true}) titleHeight: ElementRef;
  @ViewChild('textHeight', {static: true}) textHeight: ElementRef;

  private smallHeigth = 'smallHeigth';
  private bigHeight   = 'bigHeight';
  // breakpoints for different line height and font size

  public profileIcons = ecoNewsIcons;
  public newsImage: string;

  constructor(private renderer: Renderer2) {}

  ngAfterViewChecked() {
    this.checkHeightOfTittle();
  }

  // the idea is to get the height of the header and based on it visualize the Description and Header by adding specific class names
  // another problem is that the line height and container height are different for different devices
  public checkHeightOfTittle(): void {
    const titleHeightOfElement = this.titleHeight.nativeElement.offsetHeight;
    const descCalss = this.getHeightOfDesc(titleHeightOfElement);
    const titleCalss = this.getHeightOfTitle(titleHeightOfElement);

    this.renderer.addClass(this.textHeight.nativeElement, descCalss);
    this.renderer.addClass(this.titleHeight.nativeElement, titleCalss);
  }

  public checkNewsImage(): string {
    return this.newsImage = (this.ecoNewsModel.imagePath && this.ecoNewsModel.imagePath !== ' ') ?
                              this.ecoNewsModel.imagePath : this.profileIcons.newsDefaultPictureList;
  }

  private getDomWidth(): string {
    return window.innerWidth >= 1024 && window.innerWidth < 1440 ? this.smallHeigth : this.bigHeight;
  }

  private getHeightOfDesc(titleHeigth: number): string {
    const result = possibleDescHeigth[this.getDomWidth()][titleHeigth];
    return result ? result : 'd-none';
  }

  private getHeightOfTitle(titleHeigth: number): string {
    const result = possibleTitleHeigth[this.getDomWidth()][titleHeigth];
    return result ? result :
      this.getDomWidth() === this.smallHeigth ? 'two-row' : 'tree-row';
  }
}
