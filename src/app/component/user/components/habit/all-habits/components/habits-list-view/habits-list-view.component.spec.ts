import { ServerHabitItemPageModel } from './../../../../../models/habit-item.model';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { HabitsListViewComponent } from './habits-list-view.component';

describe('HabitsListViewComponent', () => {
  let component: HabitsListViewComponent;
  let fixture: ComponentFixture<HabitsListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HabitsListViewComponent ],
      imports: [
        TranslateModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitsListViewComponent);
    component = fixture.componentInstance;
    component.habit = {
      habitTranslation: {
        description: 'string',
        habitItem: 'string',
        languageCode: 'string',
        name: '',
      },
      id: 1,
      image: 'string',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
