import { Component, Input, ViewChild, ElementRef, Renderer2, AfterViewChecked } from '@angular/core';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { ecoNewsIcons } from 'src/app/image-pathes/profile-icons';
import { possibleDescHeight, possibleTitleHeight } from '../news-list-list-view/breakpoints';

@Component({
  selector: 'app-news-list-gallery-view',
  templateUrl: './news-list-gallery-view.component.html',
  styleUrls: ['./news-list-gallery-view.component.scss'],
  changeDetection: 0,
})
export class NewsListGalleryViewComponent {
  @Input() ecoNewsModel: EcoNewsModel;
  @ViewChild('titleHeight', { static: true }) titleHeight: ElementRef;
  @ViewChild('textHeight', { static: true }) textHeight: ElementRef;

  private smallHeight = 'smallHeight';
  private bigHeight = 'bigHeight';

  public profileIcons = ecoNewsIcons;
  public newsImage: string;

  constructor(private renderer: Renderer2) { }

  ngAfterViewChecked() {
    this.checkHeightOfTittle();
  }

  public checkHeightOfTittle(): void {
    const titleHeightOfElement = this.titleHeight.nativeElement.offsetHeight;
    const descCalss = this.getHeightOfDesc(titleHeightOfElement);
    const titleCalss = this.getHeightOfTitle(titleHeightOfElement);

    this.renderer.addClass(this.textHeight.nativeElement, descCalss);
    this.renderer.addClass(this.titleHeight.nativeElement, titleCalss);
  }

  public checkNewsImage(): string {
    return (this.newsImage =
      this.ecoNewsModel.imagePath && this.ecoNewsModel.imagePath !== ' '
        ? this.ecoNewsModel.imagePath
        : this.profileIcons.newsDefaultPictureList);
  }


  private getDomWidth(): string {
    return window.innerWidth <= 768 ? this.smallHeight : this.bigHeight;
  }

  private getHeightOfDesc(titleHeight: number): string {
    const result = possibleDescHeight[this.getDomWidth()][titleHeight];
    const smallTitleHeight = titleHeight > 26 ? 'two-row' : 'tree-row';
    const midTitleHeught = titleHeight > 52 ? 'one-row' : smallTitleHeight;
    const largeTitleheight = titleHeight > 78 ? 'd-none' : midTitleHeught;
    return result ? result : largeTitleheight;
  }

  private getHeightOfTitle(titleHeight: number): string {
    const result = possibleTitleHeight[this.getDomWidth()][titleHeight];
    const smallTitleHeight = titleHeight > 26 ? 'two-row' : 'one-row';
    const midTitleHeught = titleHeight > 52 ? 'tree-row' : smallTitleHeight;
    const largeTitleheight = titleHeight > 78 ? 'four-row' : midTitleHeught;
    return result ? result : largeTitleheight;
  }
}
