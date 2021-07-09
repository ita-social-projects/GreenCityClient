import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddViolationsComponent } from './add-violations.component';

describe('AddViolationsComponent', () => {
  let component: AddViolationsComponent;
  let fixture: ComponentFixture<AddViolationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddViolationsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddViolationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
