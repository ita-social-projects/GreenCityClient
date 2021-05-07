import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HabitItemsAmountStatisticDto } from '@global-models/goal/HabitItemsAmountStatisticDto';
import { UserService } from 'src/app/main/service/user/user.service';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { StatRowComponent } from '..';

import { StatRowsComponent } from './stat-rows.component';

describe('StatRowsComponent', () => {
  let component: StatRowsComponent;
  let fixture: ComponentFixture<StatRowsComponent>;
  let userServiceMock: UserService;
  userServiceMock = jasmine.createSpyObj('UserService', ['getTodayStatisticsForAllHabitItems']);
  userServiceMock.getTodayStatisticsForAllHabitItems = (): Observable<Array<HabitItemsAmountStatisticDto>> =>
    of([
      {
        habitItem: 'string',
        notTakenItems: 1,
      },
    ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatRowsComponent, StatRowComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [{ provide: UserService, useValue: userServiceMock }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
