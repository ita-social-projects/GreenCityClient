import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { FriendItemComponent } from './friend-item.component';

describe('FriendItemComponent', () => {
  let component: FriendItemComponent;
  let fixture: ComponentFixture<FriendItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendItemComponent ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendItemComponent);
    component = fixture.componentInstance;
    component.friend = { id: 1,
      name: 'Name',
      profilePicture: '',
      added: true
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it( 'it should call addFriendEvent on click', () => {
    spyOn(component.addFriendEvent, 'emit');
    component.addFriend(component.friend.id);
    expect(component.addFriendEvent.emit).toHaveBeenCalledWith(1);
  });

  it( 'it should call deleteFriendEvent on click', () => {
    spyOn(component.deleteFriendEvent, 'emit');
    component.deleteFriend(component.friend.id);
    expect(component.deleteFriendEvent.emit).toHaveBeenCalledWith(1);
  });
});
