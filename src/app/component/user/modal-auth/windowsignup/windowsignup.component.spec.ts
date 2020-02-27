import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowsignupComponent } from './windowsignup.component';

describe('WindowsignupComponent', () => {
  let component: WindowsignupComponent;
  let fixture: ComponentFixture<WindowsignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WindowsignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowsignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
