import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePrivacyComponent } from './profile-privacy.component';

describe('ProfilePrivacyComponent', () => {
  let component: ProfilePrivacyComponent;
  let fixture: ComponentFixture<ProfilePrivacyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePrivacyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
