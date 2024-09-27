import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AchievementDto } from '@global-models/achievement/AchievementDto';
import { AchievementCategoryDto } from '@global-models/achievementCategory/achievementCategoryDto.model';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { PROFILE_IMAGES } from 'src/app/main/image-pathes/profile-images';

@Component({
  selector: 'app-achievement-item',
  templateUrl: './achievement-item.component.html',
  styleUrls: ['./achievement-item.component.scss']
})
export class AchievementItemComponent {
  @Input() item: AchievementDto | AchievementCategoryDto;
  @Input() isCategory: boolean = false;
  @Output() selectItem = new EventEmitter<AchievementDto | AchievementCategoryDto>();
  achievementsImages = PROFILE_IMAGES.achs;

  constructor(public langService: LanguageService) {}

  onItemClick() {
    if (this.isCategory) {
      this.selectItem.emit(this.item);
    }
  }

  getProgressValue(): number {
    if (this.isCategory) {
      const categoryItem = this.item as AchievementCategoryDto;
      return (categoryItem.achieved / categoryItem.totalQuantity) * 100;
    } else {
      const achievementItem = this.item as AchievementDto;
      return (achievementItem.progress / achievementItem.condition) * 100;
    }
  }

  getImagePath(): string {
    if (this.isCategory) {
      const categoryItem = this.item as AchievementCategoryDto;
      return this.achievementsImages[categoryItem.id - 1];
    } else {
      const achievementItem = this.item as AchievementDto;
      return this.achievementsImages[achievementItem.achievementCategory.id - 1];
    }
  }

  isGreyscale(): boolean {
    if (this.isCategory) {
      const categoryItem = this.item as AchievementCategoryDto;
      return categoryItem.achieved < categoryItem.totalQuantity;
    } else {
      const achievementItem = this.item as AchievementDto;
      return achievementItem.progress < achievementItem.condition;
    }
  }

  getTitle(): string {
    return this.isCategory
      ? this.langService.getLangValue((this.item as AchievementCategoryDto).title, (this.item as AchievementCategoryDto).titleEn)
      : this.langService.getLangValue((this.item as AchievementDto).name, (this.item as AchievementDto).nameEng);
  }

  getStatistics(): string {
    if (this.isCategory) {
      const categoryItem = this.item as AchievementCategoryDto;
      return `${categoryItem.achieved}/${categoryItem.totalQuantity}`;
    } else {
      const achievementItem = this.item as AchievementDto;
      const achieved = Math.min(achievementItem.progress, achievementItem.condition);
      return `${achieved}/${achievementItem.condition}`;
    }
  }
}
