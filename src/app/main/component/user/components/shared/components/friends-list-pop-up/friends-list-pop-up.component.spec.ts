import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsListPopUpComponent } from './friends-list-pop-up.component';

describe('FriendsListPopUpComponent', () => {
  let component: FriendsListPopUpComponent;
  let fixture: ComponentFixture<FriendsListPopUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FriendsListPopUpComponent]
    });
    fixture = TestBed.createComponent(FriendsListPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
