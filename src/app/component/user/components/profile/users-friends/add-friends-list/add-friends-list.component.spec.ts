import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFriendsListComponent } from './add-friends-list.component';

describe('AddFriendsListComponent', () => {
  let component: AddFriendsListComponent;
  let fixture: ComponentFixture<AddFriendsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFriendsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFriendsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
