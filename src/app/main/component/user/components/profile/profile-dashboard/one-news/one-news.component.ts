import { Component, Input, OnInit } from '@angular/core';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { userAssignedCardsIcons } from 'src/app/main/image-pathes/profile-icons';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LanguageService } from 'src/app/main/i18n/language.service';

@Component({
  selector: 'app-one-news',
  templateUrl: './one-news.component.html',
  styleUrls: ['./one-news.component.scss']
})
export class OneNewsComponent implements OnInit {
  @Input() ecoNewsModel: EcoNewsModel;

  public tags: Array<string>;
  private destroy: Subject<boolean> = new Subject<boolean>();

  public profileIcons = userAssignedCardsIcons;

  constructor(private localStorageService: LocalStorageService, private langService: LanguageService) {}

  ngOnInit(): void {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((lang: string) => {
      this.tags = this.langService.getLangValue(this.ecoNewsModel.tagsUa, this.ecoNewsModel.tagsEn) as string[];
    });
  }

  public checkNewsImage(): string {
    if (this.ecoNewsModel.imagePath && this.ecoNewsModel.imagePath !== ' ') {
      return this.ecoNewsModel.imagePath;
    } else {
      return this.profileIcons.newsDefaultPictureProfile;
    }
  }
}
