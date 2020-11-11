import { UserSharedModule } from './../../../shared/user-shared.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileHeaderComponent } from './profile-header.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ProfileProgressComponent } from '../profile-progress/profile-progress.component';

describe('ProfileHeaderComponent', () => {
  let component: ProfileHeaderComponent;
  let fixture: ComponentFixture<ProfileHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProfileHeaderComponent,
        ProfileProgressComponent
      ],
      imports: [
        UserSharedModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: Router, useValue: [] }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
