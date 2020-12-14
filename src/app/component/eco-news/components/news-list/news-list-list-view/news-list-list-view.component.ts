import { Component, Input, ViewChild, ElementRef, Renderer2, AfterViewChecked } from '@angular/core';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { ecoNewsIcons } from 'src/app/image-pathes/profile-icons';

@Component({
  selector: 'app-news-list-list-view',
  templateUrl: './news-list-list-view.component.html',
  styleUrls: ['./news-list-list-view.component.scss'],
  changeDetection: 0
})
export class NewsListListViewComponent {
  @Input() ecoNewsModel: EcoNewsModel;
  @ViewChild('titleHeight', {static: true}) titleHeight: ElementRef;
  @ViewChild('textHeight', {static: true}) textHeight: ElementRef;

  // breakpoints for different line height and font size
  private possibleDescHeigth = {
    smallHeigth: {
      26: () => 'one-row',
      52: () => 'd-none',
      72: () => 'd-none',
      78: () => 'd-none',
      96: () => 'd-none',
      104:() => 'd-none',
    },
    bigHeight: {
      24: () => 'two-row',
      26: () => 'tree-row',
      48: () => 'one-row',
      52: () => 'two-row',
      72: () => 'd-none',
      78: () => 'd-none',
      96: () => 'd-none',
    }
  };

  private possibleTitleHeigth = {
    smallHeigth: {
      26: () => 'one-row',
      52: () => 'two-row',
      78: () => 'two-row',
      104:() => 'two-row',
    },
    bigHeight: {
      24: () => 'one-row',
      26: () => 'one-row',
      48: () => 'two-row',
      52: () => 'two-row',
      72: () => 'tree-row',
      78: () => 'tree-row',
      96: () => 'tree-row',
      104:() => 'tree-row'
    }
  };

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
    const descCalss = this.getHeightOfDesc(titleHeightOfElement)
    const titleCalss = this.getHeightOfTitle(titleHeightOfElement)
    
    this.renderer.addClass(this.textHeight.nativeElement, descCalss)
    this.renderer.addClass(this.titleHeight.nativeElement, titleCalss)
  }

  public checkNewsImage(): string {
    return this.newsImage = (this.ecoNewsModel.imagePath && this.ecoNewsModel.imagePath !== ' ') ?
                              this.ecoNewsModel.imagePath : this.profileIcons.newsDefaultPictureList;
  }

  private getDomWidth(): string {
    return window.innerWidth >= 1024 && window.innerWidth < 1440 ? 'smallHeigth' : 'bigHeight'; 
  }

  private getHeightOfDesc(titleHeigth: number): string {
    console.log('getHeightOfDesc', titleHeigth, this.getDomWidth())
    return this.possibleDescHeigth[this.getDomWidth()][titleHeigth]();
  }

  private getHeightOfTitle(titleHeigth: number): string {
    console.log('getHeightOfTitle', titleHeigth, this.getDomWidth())
    return this.possibleTitleHeigth[this.getDomWidth()][titleHeigth]();
  }
}
