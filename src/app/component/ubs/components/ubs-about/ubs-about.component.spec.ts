import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsAboutComponent } from './ubs-about.component';

describe('UbsAboutComponent', () => {
  let component: UbsAboutComponent;
  let fixture: ComponentFixture<UbsAboutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UbsAboutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
