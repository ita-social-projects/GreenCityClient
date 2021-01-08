import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsFormComponent } from './ubs-form.component';

describe('UbsFormComponent', () => {
  let component: UbsFormComponent;
  let fixture: ComponentFixture<UbsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UbsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
