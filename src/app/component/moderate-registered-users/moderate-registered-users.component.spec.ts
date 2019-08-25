import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerateRegisteredUsersComponent } from './moderate-registered-users.component';

describe('ModerateRegisteredUsersComponent', () => {
  let component: ModerateRegisteredUsersComponent;
  let fixture: ComponentFixture<ModerateRegisteredUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModerateRegisteredUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModerateRegisteredUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
