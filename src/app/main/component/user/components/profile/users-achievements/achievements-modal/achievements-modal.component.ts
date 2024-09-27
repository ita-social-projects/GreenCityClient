import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AchievementDto } from '@global-models/achievement/AchievementDto';
import { AchievementService } from '@global-service/achievement/achievement.service';
import { EditProfileModel } from '@global-user/models/edit-profile.model';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../profile-service/profile.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AchievementCategoryDto } from '@global-models/achievementCategory/achievementCategoryDto.model';
import { LanguageService } from 'src/app/main/i18n/language.service';

@Component({
  selector: 'app-achievements-modal',
  templateUrl: './achievements-modal.component.html',
  styleUrls: ['./achievements-modal.component.scss']
})
export class AchievementsModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject();
  userInfo: EditProfileModel;
  achievements: AchievementDto[];
  selectedCategory: AchievementCategoryDto;
  categories: AchievementCategoryDto[];
  achievedAmount$: Observable<number>;
  totalAmount$: Observable<number>;

  constructor(
    private achievementService: AchievementService,
    private profileService: ProfileService,
    private dialogRef: MatDialogRef<AchievementsModalComponent>,
    public langService: LanguageService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit() {
    this.showUserInfo();
    this.achievementService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((categories) => {
        this.categories = categories;
      });
    this.achievedAmount$ = this.achievementService.getAchievedAmount();
    this.totalAmount$ = this.achievementService.getAchievementsAmount();
  }

  showUserInfo(): void {
    this.profileService
      .getUserInfo()
      .pipe(takeUntil(this.destroy$))
      .subscribe((item) => {
        this.userInfo = item;
      });
  }

  onCategorySelect(category) {
    this.selectedCategory = category;
    this.fetchAchievements(category.id);
  }

  fetchAchievements(categoryId: number) {
    this.achievementService.getAchievementsByCategory(categoryId).subscribe((data) => {
      this.achievements = data;
    });
  }

  close() {
    this.dialogRef.close();
  }

  backToCategories() {
    this.selectedCategory = null;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
