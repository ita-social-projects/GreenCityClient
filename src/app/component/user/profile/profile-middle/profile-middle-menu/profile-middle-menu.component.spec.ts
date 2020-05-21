import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileMiddleMenuComponent } from './profile-middle-menu.component';

describe('ProfileMiddleMenuComponent', () => {
  let component: ProfileMiddleMenuComponent;
  let fixture: ComponentFixture<ProfileMiddleMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileMiddleMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileMiddleMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
