import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ElementRef } from '@angular/core';
import { of } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AchievementDto } from '@global-models/achievement/AchievementDto';
import { AchievementService } from '@global-service/achievement/achievement.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UsersAchievementsComponent } from './users-achievements.component';
import { AchievementsModalComponent } from './achievements-modal/achievements-modal.component';

describe('UsersAchievementsComponent', () => {
  let component: UsersAchievementsComponent;
  let fixture: ComponentFixture<UsersAchievementsComponent>;

  const achievementServiceMock = jasmine.createSpyObj('AchievementService', ['getAchievements']);
  const localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['languageBehaviourSubject']);
  const dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
  const translateServiceMock = jasmine.createSpyObj('translate', ['setDefaultLang']);

  const mockAchievements: AchievementDto[] = [
    {
      id: 1,
      name: 'Achievement 1',
      nameEng: 'Eng 1',
      title: 'title1',
      achievementCategory: { id: 1, name: 'name' },
      progress: 2,
      condition: 10
    },
    {
      id: 2,
      name: 'Achievement 2',
      nameEng: 'Eng 2',
      title: 'title2',
      achievementCategory: { id: 1, name: 'name' },
      progress: 2,
      condition: 5
    },
    {
      id: 3,
      name: 'Achievement 3',
      nameEng: 'Eng 3',
      title: 'title3',
      achievementCategory: { id: 1, name: 'name' },
      progress: 4,
      condition: 4
    }
  ];
  const sliderMock = new ElementRef({});
  const nextArrowMock = new ElementRef({});
  const previousArrowMock = new ElementRef({});

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersAchievementsComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: AchievementService, useValue: achievementServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: TranslateService, useValue: translateServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersAchievementsComponent);
    component = fixture.componentInstance;
    component.slider = sliderMock;
    component.nextArrow = nextArrowMock;
    component.previousArrow = previousArrowMock;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('showAchievements', () => {
    it('should set achievements, amountOfAchievements, and totalPages', () => {
      achievementServiceMock.getAchievements.and.returnValue(of(mockAchievements));

      component.showAchievements();

      expect(component.achievements).toEqual(mockAchievements);
      expect(component.amountOfAchievements).toBe(3);
      expect(component.totalPages).toBe(1);
    });

    it('should call calculateAchievementsToShow after setting achievements', () => {
      spyOn(component, 'calculateAchievementsToShow');
      achievementServiceMock.getAchievements.and.returnValue(of(mockAchievements));

      component.showAchievements();

      expect(component.calculateAchievementsToShow).toHaveBeenCalled();
    });
  });

  describe('calculateAchievementsToShow', () => {
    it('should calculate and set achievements to show based on slideIndex and itemsPerPage', () => {
      component.achievements = mockAchievements;
      component.slideIndex = 1;

      spyOn(component, 'getAchievementsToShow').and.returnValue(2);

      component.calculateAchievementsToShow();

      expect(component.achievementsToShow.length).toBe(1);
      expect(component.achievementsToShow).toEqual([mockAchievements[2]]);
    });
  });

  xdescribe('getAchievementsToShow', () => {
    it('should return 3 items if window width is more than 768', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(800);

      const itemsToShow = component.getAchievementsToShow();

      expect(itemsToShow).toBe(3);
    });

    it('should return 5 items if window width is more than 576', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(600);

      const itemsToShow = component.getAchievementsToShow();

      expect(itemsToShow).toBe(5);
    });
  });

  describe('changeAchievements', () => {
    it('should increment slideIndex and recalculate achievements when navigating to the next page', () => {
      component.totalPages = 2;
      component.slideIndex = 0;
      spyOn(component, 'calculateAchievementsToShow');

      component.changeAchievements(true);

      expect(component.slideIndex).toBe(1);
      expect(component.calculateAchievementsToShow).toHaveBeenCalled();
    });

    it('should decrement slideIndex and recalculate achievements when navigating to the previous page', () => {
      component.totalPages = 2;
      component.slideIndex = 1;
      spyOn(component, 'calculateAchievementsToShow');

      component.changeAchievements(false);

      expect(component.slideIndex).toBe(0);
      expect(component.calculateAchievementsToShow).toHaveBeenCalled();
    });

    it('should wrap around slideIndex when navigating past the last page', () => {
      component.totalPages = 2;
      component.slideIndex = 1;
      spyOn(component, 'calculateAchievementsToShow');

      component.changeAchievements(true);

      expect(component.slideIndex).toBe(0);
      expect(component.calculateAchievementsToShow).toHaveBeenCalled();
    });

    it('should wrap around slideIndex when navigating before the first page', () => {
      component.totalPages = 2;
      component.slideIndex = 0;
      spyOn(component, 'calculateAchievementsToShow');

      component.changeAchievements(false);

      expect(component.slideIndex).toBe(1);
      expect(component.calculateAchievementsToShow).toHaveBeenCalled();
    });
  });

  xdescribe('shouldShowArrows', () => {
    it('should return true if there are more achievements than itemsPerPage and window width is less than 768', () => {
      component.achievements = mockAchievements;
      component.itemsPerPage = 2;
      spyOnProperty(window, 'innerWidth').and.returnValue(500);

      expect(component.shouldShowArrows()).toBeTrue();
    });

    it('should return false if there are fewer achievements than itemsPerPage', () => {
      component.achievements = [mockAchievements[0]];
      component.itemsPerPage = 2;

      expect(component.shouldShowArrows()).toBeFalse();
    });

    it('should return false if window width is 768 or greater', () => {
      component.achievements = mockAchievements;
      component.itemsPerPage = 2;
      spyOnProperty(window, 'innerWidth').and.returnValue(800);

      expect(component.shouldShowArrows()).toBeFalse();
    });
  });

  describe('openDialog', () => {
    it('should open the AchievementsModalComponent dialog with correct options', () => {
      component.openDialog();

      expect(dialogMock.open).toHaveBeenCalledWith(AchievementsModalComponent, {
        hasBackdrop: true,
        closeOnNavigation: true,
        panelClass: ['custom-dialog-container']
      });
    });
  });
});
