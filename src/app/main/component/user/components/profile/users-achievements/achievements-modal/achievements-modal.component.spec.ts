import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateStore } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AchievementsModalComponent } from './achievements-modal.component';
import { AchievementService } from '@global-service/achievement/achievement.service';
import { ProfileService } from '../../profile-service/profile.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditProfileModel } from '@global-user/models/edit-profile.model';
import { of } from 'rxjs';
import { AchievementCategoryDto } from '@global-models/achievementCategory/achievementCategoryDto.model';
import { AchievementDto } from '@global-models/achievement/AchievementDto';

describe('AchievementsPopupComponent', () => {
  let component: AchievementsModalComponent;
  let fixture: ComponentFixture<AchievementsModalComponent>;
  let achievementServiceMock = jasmine.createSpyObj('AchievementService', [
    'getAchievementsAmount',
    'getAchievedAmount',
    'getCategories',
    'getAchievementsByCategory'
  ]);
  let profileServiceMock = jasmine.createSpyObj('ProfileService', ['getUserInfo']);
  let dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AchievementsModalComponent],
      imports: [TranslateModule.forChild(), HttpClientTestingModule],
      providers: [
        { provide: AchievementService, useValue: achievementServiceMock },
        { provide: ProfileService, useValue: profileServiceMock },
        { provide: TranslateStore, useClass: TranslateStore },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AchievementsModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should assign userInfo when getUserInfo returns data', () => {
    const mockUserInfo: EditProfileModel = { name: 'John Doe' } as EditProfileModel;
    profileServiceMock.getUserInfo.and.returnValue(of(mockUserInfo));

    component.showUserInfo();

    expect(profileServiceMock.getUserInfo).toHaveBeenCalled();
    expect(component.userInfo).toEqual(mockUserInfo);
  });

  it('should assign categories when getCategories returns data', () => {
    const mockCategories: AchievementCategoryDto[] = [{ id: 1, title: 'Category 1' } as AchievementCategoryDto];
    achievementServiceMock.getCategories.and.returnValue(of(mockCategories));

    component.showCategories();

    expect(achievementServiceMock.getCategories).toHaveBeenCalled();
    expect(component.categories).toEqual(mockCategories);
  });

  it('should assign totalAmount and achievedAmount when data is returned', () => {
    achievementServiceMock.getAchievementsAmount.and.returnValue(of(100));
    achievementServiceMock.getAchievedAmount.and.returnValue(of(50));

    component.getStatistics();

    expect(achievementServiceMock.getAchievementsAmount).toHaveBeenCalled();
    expect(achievementServiceMock.getAchievedAmount).toHaveBeenCalled();
    expect(component.totalAmount).toBe(100);
    expect(component.achievedAmount).toBe(50);
  });

  it('should set selectedCategory and call getAchievements', () => {
    spyOn(component, 'getAchievements');
    const mockCategory: AchievementCategoryDto = { id: 1, title: 'Category 1' } as AchievementCategoryDto;

    component.onCategorySelect(mockCategory);

    expect(component.selectedCategory).toBe(mockCategory);
    expect(component.getAchievements).toHaveBeenCalledWith(mockCategory);
  });

  it('should assign achievements and update achievedAmountToShow and totalAmountToShow', () => {
    const mockCategory: AchievementCategoryDto = { id: 1, title: 'Category 1', achieved: 3, totalQuantity: 5 } as AchievementCategoryDto;
    const mockAchievements = [{ id: 1, name: 'Achievement 1' }] as AchievementDto[];
    achievementServiceMock.getAchievementsByCategory.and.returnValue(of(mockAchievements));

    component.getAchievements(mockCategory);

    expect(achievementServiceMock.getAchievementsByCategory).toHaveBeenCalledWith(1);
    expect(component.achievements).toEqual(mockAchievements);
    expect(component.achievedAmountToShow).toBe(3);
    expect(component.totalAmountToShow).toBe(5);
  });

  it('should close the dialog', () => {
    component.close();

    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should reset selectedCategory, achievements, and show total/achieved amounts', () => {
    component.achievedAmount = 2;
    component.totalAmount = 6;

    component.backToCategories();

    expect(component.selectedCategory).toBeNull();
    expect(component.achievements).toEqual([]);
    expect(component.achievedAmountToShow).toBe(2);
    expect(component.totalAmountToShow).toBe(6);
  });
});
