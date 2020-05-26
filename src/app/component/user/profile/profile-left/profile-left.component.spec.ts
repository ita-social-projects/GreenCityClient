import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLeftComponent } from './profile-left.component';

describe('ProfileLeftComponent', () => {
  let component: ProfileLeftComponent;
  let fixture: ComponentFixture<ProfileLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileLeftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
