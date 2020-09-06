import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileProgressComponent } from './profile-progress.component';
import { ProfileService } from '../../profile-service/profile.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';

@Pipe({ name: 'translate' })
class TranslatePipeMock implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('ProfileProgressComponent', () => {
  let component: ProfileProgressComponent;
  let fixture: ComponentFixture<ProfileProgressComponent>;
  let profileService: ProfileService;
  let spy: jasmine.Spy;
  let mockProgress;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProfileProgressComponent,
        TranslatePipeMock,
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        ProfileService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileProgressComponent);
    component = fixture.componentInstance;
    profileService = fixture.debugElement.injector.get(ProfileService);
    mockProgress = {
      amountHabitsInProgress: 0,
      amountHabitsAcquired: 0,
      amountWrittenTipsAndTrick: 0,
      amountPublishedNews: 0
    };
    spy = spyOn(profileService, 'getUserProfileStatistics').and.returnValue(Observable.of(mockProgress));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call profileService', () => {
    component.checkUserActivities();
    expect(spy.calls.any()).toBeTruthy();
  });
});
