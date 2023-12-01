import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserProfileImageComponent } from './user-profile-image.component';

describe('UserProfileImageComponent', () => {
  let component: UserProfileImageComponent;
  let fixture: ComponentFixture<UserProfileImageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserProfileImageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return initials', () => {
    component.firstName = 'Test test';
    expect(component.getDefaultProfileImg()).toBe('TT');
  });
});
