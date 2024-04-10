import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HabitAssignService } from './habit-assign.service';
import { habitAssignLink } from '../../links';
import {
  ASSIGNRESPONSE,
  HABITSFORDATE,
  DEFAULTFULLINFOHABIT,
  HABITSASSIGNEDLIST
} from '../../component/user/components/habit/mocks/habit-assigned-mock';
import { HabitAssignPropertiesDto } from '@global-models/goal/HabitAssignCustomPropertiesDto';
import { CustomShoppingItem } from '@global-user/models/shoppinglist.interface';
import { UpdateHabitDuration } from '@global-user/components/habit/models/interfaces/habit-assign.interface';

describe('HabitService', () => {
  let service: HabitAssignService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HabitAssignService],
      imports: [HttpClientTestingModule]
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(HabitAssignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get data', () => {
    service.getAssignedHabits().subscribe((data) => {
      expect(data).toEqual(HABITSASSIGNEDLIST);
    });
    const req = httpMock.expectOne(`${habitAssignLink}/allForCurrentUser?lang=${service.language}`);
    expect(req.request.method).toBe('GET');
    req.flush(HABITSASSIGNEDLIST);
  });

  it('should get get Habit By Assign Id', () => {
    service.getHabitByAssignId(1, 'ua').subscribe((data) => {
      expect(data).toEqual(DEFAULTFULLINFOHABIT);
    });
    const req = httpMock.expectOne(`${habitAssignLink}/1?lang=ua`);
    expect(req.request.method).toBe('GET');
    req.flush(DEFAULTFULLINFOHABIT);
  });

  it('should assign habit', () => {
    service.assignHabit(1).subscribe((habit) => {
      expect(habit).toEqual(ASSIGNRESPONSE);
    });
    const req = httpMock.expectOne(`${habitAssignLink}/1`);
    expect(req.request.method).toBe('POST');
    req.flush(ASSIGNRESPONSE);
  });

  it('should enroll by habit', () => {
    service.enrollByHabit(3, '2021-05-07').subscribe((habit) => {
      expect(habit).toEqual(DEFAULTFULLINFOHABIT);
    });
    const req = httpMock.expectOne(`${habitAssignLink}/3/enroll/2021-05-07?lang=${service.language}`);
    expect(req.request.method).toBe('POST');
    req.flush(DEFAULTFULLINFOHABIT);
  });

  it('should unenroll by habit', () => {
    service.unenrollByHabit(3, '2021-05-07').subscribe((habit) => {
      expect(habit).toEqual(DEFAULTFULLINFOHABIT);
    });
    const req = httpMock.expectOne(`${habitAssignLink}/3/unenroll/2021-05-07`);
    expect(req.request.method).toBe('POST');
    req.flush(DEFAULTFULLINFOHABIT);
  });

  it('should get assigned habits by period', () => {
    service.getAssignHabitsByPeriod('2021-05-20', '2021-05-30').subscribe((habits) => {
      expect(habits).toEqual(HABITSFORDATE);
    });
    const req = httpMock.expectOne(`${habitAssignLink}/activity/2021-05-20/to/2021-05-30?lang=${service.language}`);
    expect(req.request.method).toBe('GET');
    req.flush(HABITSFORDATE);
  });

  it('should update progress Notification Has Displayed', () => {
    service.progressNotificationHasDisplayed(1).subscribe((data) => {
      expect(data).toEqual({});
    });
    const req = httpMock.expectOne(`${habitAssignLink}/1/updateProgressNotificationHasDisplayed`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should assign custom habit', () => {
    const spy = spyOn(service, 'assignCustomHabit');
    const habitId = 1;
    const friendsIdsList = [2, 3, 4];
    const habitAssignProperties: HabitAssignPropertiesDto = {
      defaultShoppingListItems: [],
      duration: 15
    };
    const customShoppingItemList: Array<CustomShoppingItem> = [{ text: '1234567890' }];
    service.assignCustomHabit(habitId, friendsIdsList, habitAssignProperties, customShoppingItemList);
    expect(spy).toHaveBeenCalled();
  });

  it('should update habit duration', () => {
    const habitId = 1;
    const duration = 30;
    const expectedRes: Partial<UpdateHabitDuration> = { habitId, duration };
    let actualRes: Partial<UpdateHabitDuration>;

    service.updateHabitDuration(habitId, duration).subscribe((res) => {
      actualRes = res;
    });

    const req = httpMock.expectOne(`${habitAssignLink}/${habitId}/update-habit-duration?duration=${duration}`);
    req.flush(expectedRes);
    httpMock.verify();
    expect(req.request.method).toBe('PUT');
    expect(actualRes).toEqual(expectedRes);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
