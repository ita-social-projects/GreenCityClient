import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowsigninComponent } from './windowsignin.component';

describe('WindowsigninComponent', () => {
  let component: WindowsigninComponent;
  let fixture: ComponentFixture<WindowsigninComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WindowsigninComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowsigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
