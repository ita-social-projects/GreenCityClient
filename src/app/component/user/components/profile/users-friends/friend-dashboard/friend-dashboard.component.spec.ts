import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendDashboardComponent } from './friend-dashboard.component';

describe('FriendDashboardComponent', () => {
  let component: FriendDashboardComponent;
  let fixture: ComponentFixture<FriendDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
