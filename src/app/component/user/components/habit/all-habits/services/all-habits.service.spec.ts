import { environment } from '@environment/environment';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ServerHabitItemModel } from '@global-user/models/habit-item.model';
import { BehaviorSubject } from 'rxjs';

import { AllHabitsService } from './all-habits.service';

describe('AllHabitsService', () => {
  let service: AllHabitsService;
  let httpTestingController: HttpTestingController;

  const mockData: ServerHabitItemModel = {
    totalPages: 1,
    totalElements: 1,
    page: [{
      habitTranslation: {
        description: '',
        habitItem: '',
        languageCode: '',
        name: '',
      },
      id: 1,
      image: ''
    }],
    currentPage: 1
  };

  beforeEach(async(() => TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    })
  ));

  it('should be created', async(() => {
    service = TestBed.get(AllHabitsService);
    expect(service).toBeTruthy();
  }));

  describe('Test main functionality', () => {
    beforeEach(() => {
      service = TestBed.get(AllHabitsService);
      service.allHabits = new BehaviorSubject(['test']);
      httpTestingController = TestBed.get(HttpTestingController);
    });

    it('Should reset subject data', async(() => {
      service.resetSubject();
      expect(service.allHabits.getValue()).toEqual([]);
    }));

    it('Should fetch new data', async(() => {
      service.fetchAllHabits(0, 1);
      const req = httpTestingController.expectOne(`${environment.backendLink}habit?page=${0}&size=${1}&lang=en`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockData);
      expect(service.allHabits.getValue()).toEqual(mockData);
    }));

    it('Should fetch more data', async(() => {
      service.allHabits = new BehaviorSubject(mockData);
      service.fetchAllHabits(0, 1);
      const req = httpTestingController.expectOne(`${environment.backendLink}habit?page=${0}&size=${1}&lang=en`);
      req.flush(mockData);
      expect(service.allHabits.getValue()).toBeTruthy();
    }));
  });
});
