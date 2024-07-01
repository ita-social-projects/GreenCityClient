import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsListPopUpComponent } from './friends-list-pop-up.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { of } from 'rxjs';
import { UserProfileImageComponent } from '../user-profile-image/user-profile-image.component';

describe('FriendsListPopUpComponent', () => {
  let component: FriendsListPopUpComponent;
  let fixture: ComponentFixture<FriendsListPopUpComponent>;

  const dialogRefStub = {
    close() {}
  };

  const popupDataStub = {
    friends: [
      {
        id: 1,
        name: 'Ivan Petrov',
        profilePicturePath: 'photo/petrov.jpg'
      },
      {
        id: 2,
        name: 'Dmytro',
        profilePicturePath: 'photo/ivanov.jpg'
      }
    ],
    habitId: 1
  };

  const friendsHabitProgress = [
    {
      userId: 1,
      duration: 14,
      workingDays: 5
    },
    {
      userId: 2,
      duration: 10,
      workingDays: 1
    }
  ];

  const habitAssignService: HabitAssignService = jasmine.createSpyObj('HabitAssignService', ['getFriendsHabitProgress']);
  habitAssignService.getFriendsHabitProgress = () => of(friendsHabitProgress);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FriendsListPopUpComponent, UserProfileImageComponent],
      imports: [MatDialogModule, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: popupDataStub },
        { provide: HabitAssignService, useValue: habitAssignService }
      ]
    });
    fixture = TestBed.createComponent(FriendsListPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Testing the basic functionality', () => {
    it('should close dialog by onClose function call', () => {
      const spy = spyOn((component as any).matDialogRef, 'close');
      component.onClose();
      expect(spy).toHaveBeenCalled();
    });

    it('should call getFriendsHabitProgress inside ngOnInit', () => {
      const spy = spyOn(component as any, 'getFriendsHabitProgress');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getFriendsHabitProgress', () => {
    it('should set friends correctly', () => {
      component.getFriendsHabitProgress();
      expect(component.friends[0].habitProggress).toBeTruthy();
      expect(component.friends[0].habitProggress.userId).toBe(1);
      expect(component.friends[0].name).toBe('Ivan Petrov');
      expect(component.friends[1].name).toBe('Dmytro');
    });
  });
});
