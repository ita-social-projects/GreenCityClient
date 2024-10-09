import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AchievementItemComponent } from './achievement-item.component';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { AchievementCategoryDto } from '@global-models/achievementCategory/achievementCategoryDto.model';
import { AchievementDto } from '@global-models/achievement/AchievementDto';
import { PROFILE_IMAGES } from 'src/app/main/image-pathes/profile-images';

describe('AchievementItemComponent', () => {
  let component: AchievementItemComponent;
  let fixture: ComponentFixture<AchievementItemComponent>;
  let langServiceMock: jasmine.SpyObj<LanguageService>;

  const categoryItemMock: AchievementCategoryDto = {
    id: 2,
    title: 'Category 1',
    titleEn: 'Category 1 EN',
    achieved: 5,
    totalQuantity: 20
  };

  const achievementItemMock: AchievementDto = {
    id: 1,
    title: 'title',
    achievementCategory: { id: 1, name: 'category 1' },
    name: 'Achievement 1',
    nameEng: 'Achievement 1 EN',
    progress: 2,
    condition: 10
  };

  const itemToUseMock = {
    categoryId: 1,
    title: 'Achievement 1',
    titleEn: 'Achievement 1 EN',
    achieved: 2,
    totalQuantity: 10
  };

  beforeEach(() => {
    langServiceMock = jasmine.createSpyObj('LanguageService', ['getLangValue']);

    TestBed.configureTestingModule({
      declarations: [AchievementItemComponent],
      imports: [MatProgressSpinnerModule],
      providers: [{ provide: LanguageService, useValue: langServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(AchievementItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('transformItem', () => {
    it('should transform a category item when isCategory is true', () => {
      component.isCategory = true;
      const result = component.transformItem(categoryItemMock);

      expect(result).toEqual({
        categoryId: categoryItemMock.id,
        title: categoryItemMock.title,
        titleEn: categoryItemMock.titleEn,
        achieved: categoryItemMock.achieved,
        totalQuantity: categoryItemMock.totalQuantity
      });
    });

    it('should transform an achievement item when isCategory is false', () => {
      component.isCategory = false;
      const result = component.transformItem(achievementItemMock);

      expect(result).toEqual({
        categoryId: achievementItemMock.achievementCategory.id,
        title: achievementItemMock.name,
        titleEn: achievementItemMock.nameEng,
        achieved: achievementItemMock.progress,
        totalQuantity: achievementItemMock.condition
      });
    });
  });

  describe('getProgressValue', () => {
    it('should calculate the correct progress value', () => {
      component.itemToUse = itemToUseMock;
      const progressValue = component.getProgressValue();
      expect(progressValue).toEqual(20);
    });
  });

  describe('getImagePath', () => {
    it('should return the correct image path', () => {
      component.achievementsImages = PROFILE_IMAGES.achs;
      component.itemToUse = { ...itemToUseMock, categoryId: 2 };
      const imagePath = component.getImagePath();
      expect(imagePath).toBe('assets/img/profile/achievements/COMMENT_OR_REPLY.png');
    });
  });

  describe('isGreyscale', () => {
    it('should return true if achieved is less than totalQuantity', () => {
      component.itemToUse = { ...itemToUseMock, achieved: 3, totalQuantity: 5 };
      expect(component.isGreyscale()).toBeTrue();
    });

    it('should return false if achieved is equal to or greater than totalQuantity', () => {
      component.itemToUse = { ...itemToUseMock, achieved: 5, totalQuantity: 5 };
      expect(component.isGreyscale()).toBeFalse();
    });
  });

  describe('getTitle', () => {
    it('should return the correct title based on language service', () => {
      component.itemToUse = { ...itemToUseMock, title: 'Title', titleEn: 'Title EN' };
      langServiceMock.getLangValue.and.returnValue('Title EN');

      const title = component.getTitle();
      expect(title).toBe('Title EN');
      expect(langServiceMock.getLangValue).toHaveBeenCalledWith('Title', 'Title EN');
    });
  });

  describe('getStatistics', () => {
    it('should return the correct statistics string', () => {
      component.itemToUse = { ...itemToUseMock, achieved: 7, totalQuantity: 10 };
      const statistics = component.getStatistics();
      expect(statistics).toBe('7/10');
    });

    it('should not exceed totalQuantity in statistics', () => {
      component.itemToUse = { ...itemToUseMock, achieved: 15, totalQuantity: 10 };
      const statistics = component.getStatistics();
      expect(statistics).toBe('10/10');
    });
  });
});
