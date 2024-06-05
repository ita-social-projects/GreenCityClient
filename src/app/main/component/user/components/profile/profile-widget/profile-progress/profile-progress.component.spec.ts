import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProfileProgressComponent } from './profile-progress.component';
import { ProfileService } from '../../profile-service/profile.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

describe('ProfileProgressComponent', () => {
  let component: ProfileProgressComponent;
  let fixture: ComponentFixture<ProfileProgressComponent>;
  let profileService: ProfileService;
  let spy: jasmine.Spy;
  let mockProgress;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileProgressComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [ProfileService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileProgressComponent);
    component = fixture.componentInstance;
    profileService = fixture.debugElement.injector.get(ProfileService);
    mockProgress = {
      amountHabitsInProgress: 0,
      amountHabitsAcquired: 0,
      amountPublishedNews: 0
    };
    spy = spyOn(profileService, 'getUserProfileStatistics').and.returnValue(of(mockProgress));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
