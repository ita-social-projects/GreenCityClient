import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInNewComponent } from './sign-in-new.component';

describe('SignInNewComponent', () => {
  let component: SignInNewComponent;
  let fixture: ComponentFixture<SignInNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignInNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
