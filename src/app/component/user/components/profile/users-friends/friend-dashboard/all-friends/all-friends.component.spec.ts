import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllFriendsComponent } from './all-friends.component';

describe('AllFriendsComponent', () => {
  let component: AllFriendsComponent;
  let fixture: ComponentFixture<AllFriendsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllFriendsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
