import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AchievementDto } from '@global-models/achievement/AchievementDto';
import { AchievementService } from '@global-service/achievement/achievement.service';
import { EditProfileModel } from '@global-user/models/edit-profile.model';
import { Subject, takeUntil } from 'rxjs';
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
  achievedAmount: number;
  totalAmount: number;
  achievedAmountToShow: number;
  totalAmountToShow: number;

  constructor(
    private achievementService: AchievementService,
    private profileService: ProfileService,
    private dialogRef: MatDialogRef<AchievementsModalComponent>,
    public langService: LanguageService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit() {
    this.showUserInfo();
    this.showCategories();
    this.getStatistics();
  }

  showUserInfo(): void {
    this.profileService
      .getUserInfo()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.userInfo = user;
      });
  }

  showCategories(): void {
    this.achievementService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((categories) => {
        this.categories = categories;
      });
  }

  getStatistics(): void {
    this.achievementService
      .getAchievementsAmount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((achievementsAmount) => {
        this.totalAmount = achievementsAmount;
        this.totalAmountToShow = achievementsAmount;
      });
    this.achievementService
      .getAchievedAmount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((achievedAmount) => {
        this.achievedAmount = achievedAmount;
        this.achievedAmountToShow = achievedAmount;
      });
  }

  onCategorySelect(category) {
    this.selectedCategory = category;
    this.getAchievements(category);
  }

  getAchievements(category: AchievementCategoryDto) {
    this.achievementService
      .getAchievementsByCategory(category.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.achievements = data;
      });
    this.achievedAmountToShow = category.achieved;
    this.totalAmountToShow = category.totalQuantity;
  }

  close() {
    this.dialogRef.close();
  }

  backToCategories() {
    this.selectedCategory = null;
    this.achievements = [];
    this.achievedAmountToShow = this.achievedAmount;
    this.totalAmountToShow = this.totalAmount;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
