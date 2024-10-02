import { Component, Input, OnInit } from '@angular/core';
import { AchievementDto } from '@global-models/achievement/AchievementDto';
import { AchievementCategoryDto } from '@global-models/achievementCategory/achievementCategoryDto.model';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { PROFILE_IMAGES } from 'src/app/main/image-pathes/profile-images';

@Component({
  selector: 'app-achievement-item',
  templateUrl: './achievement-item.component.html',
  styleUrls: ['./achievement-item.component.scss']
})
export class AchievementItemComponent implements OnInit {
  @Input() item: AchievementDto | AchievementCategoryDto;
  @Input() isCategory = false;

  achievementsImages = PROFILE_IMAGES.achs;
  itemToUse: {
    categoryId: number;
    title: string;
    titleEn: string;
    achieved: number;
    totalQuantity: number;
  };

  constructor(public langService: LanguageService) {}

  ngOnInit(): void {
    this.itemToUse = this.transformItem(this.item);
  }

  transformItem(item: AchievementDto | AchievementCategoryDto) {
    if (this.isCategory) {
      const categoryItem = item as AchievementCategoryDto;
      return {
        categoryId: categoryItem.id,
        title: categoryItem.title,
        titleEn: categoryItem.titleEn,
        achieved: categoryItem.achieved,
        totalQuantity: categoryItem.totalQuantity
      };
    } else {
      const achievementItem = item as AchievementDto;
      return {
        categoryId: achievementItem.achievementCategory.id,
        title: achievementItem.name,
        titleEn: achievementItem.nameEng,
        achieved: achievementItem.progress,
        totalQuantity: achievementItem.condition
      };
    }
  }

  getProgressValue(): number {
    return (this.itemToUse.achieved / this.itemToUse.totalQuantity) * 100;
  }

  getImagePath(): string {
    return this.achievementsImages[this.itemToUse.categoryId - 1];
  }

  isGreyscale(): boolean {
    return this.itemToUse.achieved < this.itemToUse.totalQuantity;
  }

  getTitle(): string {
    return this.langService.getLangValue(this.itemToUse.title, this.itemToUse.titleEn);
  }

  getStatistics(): string {
    const achieved = Math.min(this.itemToUse.achieved, this.itemToUse.totalQuantity);
    return `${achieved}/${this.itemToUse.totalQuantity}`;
  }
}
