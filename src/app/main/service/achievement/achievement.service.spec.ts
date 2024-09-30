import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AchievementService } from './achievement.service';
import { AchievementDto } from '@global-models/achievement/AchievementDto';
import { achievementLink } from '../../links';

describe('AchievementService', () => {
  let httpMock: HttpTestingController;
  let service: AchievementService;

  const mockAchievementDto: AchievementDto[] = [
    {
      id: 1,
      name: 'Achievement 1',
      nameEng: 'Eng',
      title: 'Title 1',
      achievementCategory: { id: 1, name: 'Category 1' },
      progress: 100,
      condition: 100
    },
    {
      id: 2,
      name: 'Achievement 2',
      nameEng: 'Eng',
      title: 'Title 2',
      achievementCategory: { id: 2, name: 'Category 2' },
      progress: 50,
      condition: 100
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AchievementService]
    });
    service = TestBed.inject(AchievementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve achievements using GET request', () => {
    service.getAchievements().subscribe((achievements) => {
      expect(achievements.length).toBe(2);
      expect(achievements).toEqual(mockAchievementDto);
    });

    const req = httpMock.expectOne(`${achievementLink}?achievementStatus=ACHIEVED`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAchievementDto);
  });

  it('should retrieve the total amount of achievements using GET request', () => {
    const mockCount = 42;

    service.getAchievementsAmount().subscribe((count) => {
      expect(count).toBe(mockCount);
    });

    const req = httpMock.expectOne(`${achievementLink}/count`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCount);
  });

  it('should retrieve the amount of achieved achievements using GET request', () => {
    const mockAchievedCount = 20;

    service.getAchievedAmount().subscribe((achievedCount) => {
      expect(achievedCount).toBe(mockAchievedCount);
    });

    const req = httpMock.expectOne(`${achievementLink}/count?achievementStatus=ACHIEVED`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAchievedCount);
  });

  it('should retrieve achievements by category using GET request', () => {
    const categoryId = 1;

    service.getAchievementsByCategory(categoryId).subscribe((achievements) => {
      expect(achievements.length).toBe(2);
      expect(achievements).toEqual(mockAchievementDto);
    });

    const req = httpMock.expectOne(`${achievementLink}?achievementCategoryId=${categoryId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAchievementDto);
  });

  it('should retrieve categories using GET request', () => {
    const mockCategories = [
      {
        id: 1,
        title: 'Category 1',
        titleEn: 'Category 1 EN',
        achieved: 5,
        totalQuantity: 7
      },
      {
        id: 2,
        title: 'Category 2',
        titleEn: 'Category 2 EN',
        achieved: 5,
        totalQuantity: 7
      }
    ];

    service.getCategories().subscribe((categories) => {
      expect(categories.length).toBe(2);
      expect(categories).toEqual(mockCategories);
    });

    const req = httpMock.expectOne(`${achievementLink}/categories`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });
});
