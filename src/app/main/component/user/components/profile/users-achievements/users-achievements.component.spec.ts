import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAchievementsComponent } from './users-achievements.component';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UsersAchievementsComponent', () => {
  let component: UsersAchievementsComponent;
  let fixture: ComponentFixture<UsersAchievementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [UsersAchievementsComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersAchievementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
