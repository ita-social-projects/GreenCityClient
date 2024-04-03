import { userAssignedCardsIcons } from '../../../../../image-pathes/profile-icons';
import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  Renderer2,
  AfterViewChecked,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnInit,
  OnDestroy
} from '@angular/core';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { TranslateService } from '@ngx-translate/core';
import { possibleDescHeight, possibleTitleHeight } from './breakpoints';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-news-list-list-view',
  templateUrl: './news-list-list-view.component.html',
  styleUrls: ['./news-list-list-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsListListViewComponent implements AfterViewChecked, AfterViewInit, OnInit, OnDestroy {
  @Input() ecoNewsModel: EcoNewsModel;
  @Input() ecoNewsText: string;
  @ViewChild('ecoNewsText', { static: true }) text: ElementRef;
  @ViewChild('titleHeight', { static: true }) titleHeight: ElementRef;
  @ViewChild('textHeight', { static: true }) textHeight: ElementRef;

  private smallHeight = 'smallHeight';
  private bigHeight = 'bigHeight';
  public profileIcons = userAssignedCardsIcons;
  public newsImage: string;
  public tags: Array<string>;
  public currentLang: string;
  private destroy: Subject<boolean> = new Subject<boolean>();

  public newDate;
  public datePipe;

  constructor(
    public router: Router,
    private renderer: Renderer2,
    public translate: TranslateService,
    public localStorageService: LocalStorageService,
    private langService: LanguageService
  ) {}
  ngOnInit() {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((lang: string) => {
      this.currentLang = lang;
      this.tags = this.langService.getLangValue(this.ecoNewsModel.tagsUa, this.ecoNewsModel.tagsEn) as string[];
      this.datePipe = new DatePipe(this.currentLang);
      this.newDate = this.datePipe.transform(this.ecoNewsModel.creationDate, 'MMM dd, yyyy');
    });
  }

  ngAfterViewChecked() {
    this.checkHeightOfTittle();
  }

  ngAfterViewInit() {
    this.text.nativeElement.innerHTML = this.ecoNewsModel.content;
  }

  // the idea is to get the height of the header and based on it visualize the Description and Header by adding specific class names
  // another problem is that the line height and container height are different for different devices
  public checkHeightOfTittle(): void {
    const titleHeightOfElement = this.titleHeight.nativeElement.offsetHeight;
    const descClass = this.getHeightOfDesc(titleHeightOfElement);
    const titleClass = this.getHeightOfTitle(titleHeightOfElement);

    this.renderer.addClass(this.textHeight.nativeElement, descClass);
    this.renderer.addClass(this.titleHeight.nativeElement, titleClass);
  }

  public checkNewsImage(): string {
    this.newsImage =
      this.ecoNewsModel.imagePath && this.ecoNewsModel.imagePath !== ' '
        ? this.ecoNewsModel.imagePath
        : this.profileIcons.newsDefaultPictureList;
    return this.newsImage;
  }

  private getDomWidth(): string {
    return window.innerWidth <= 768 ? this.smallHeight : this.bigHeight;
  }

  public routeToNews(): void {
    this.router.navigate(['/news', this.ecoNewsModel.id]);
  }

  private getHeightOfDesc(titleHeight: number): string {
    const result = possibleDescHeight[this.getDomWidth()][titleHeight];
    const smallTitleHeight = titleHeight > 26 ? 'two-row' : 'tree-row';
    const midTitleHeight = titleHeight > 52 ? 'one-row' : smallTitleHeight;
    return result || midTitleHeight;
  }

  private getHeightOfTitle(titleHeight: number): string {
    const result = possibleTitleHeight[this.getDomWidth()][titleHeight];
    const smallTitleHeight = titleHeight > 26 ? 'two-row' : 'one-row';
    const midTitleHeight = titleHeight > 52 ? 'tree-row' : smallTitleHeight;
    return result || midTitleHeight;
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }
}
