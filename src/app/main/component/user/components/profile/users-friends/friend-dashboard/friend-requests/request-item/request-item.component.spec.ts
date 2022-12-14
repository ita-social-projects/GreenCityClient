import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { RequestItemComponent } from './request-item.component';
import { Router } from '@angular/router';

describe('RequestItemComponent', () => {
  let component: RequestItemComponent;
  let fixture: ComponentFixture<RequestItemComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequestItemComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestItemComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);
    spyOn(router, 'navigate');
    component.request = {
      id: 1,
      name: 'Name',
      profilePicturePath: '',
      added: true,
      rating: 380,
      friendsChatDto: {
        chatExists: true,
        chatId: 2
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should call accept on click', () => {
    spyOn(component.acceptEvent, 'emit');
    component.accept(component.request.id);
    expect(component.acceptEvent.emit).toHaveBeenCalledWith(1);
  });

  it('it should call decline on click', () => {
    spyOn(component.declineEvent, 'emit');
    component.decline(component.request.id);
    expect(component.declineEvent.emit).toHaveBeenCalledWith(1);
  });

  it('it should call redirectToFriendPage with router', () => {
    component.redirectToFriendPage();
    expect(router.navigate).toHaveBeenCalledWith(
      ['profile', component.userId, 'friends', 'Name', 1],
      Object({ queryParams: Object({ tab: 'All firends', index: 3 }) })
    );
  });
});
