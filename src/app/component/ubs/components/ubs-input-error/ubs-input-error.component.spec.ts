import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UBSInputErrorComponent } from './ubs-input-error.component';

describe('ErrorComponent', () => {
  let component: UBSInputErrorComponent;
  let fixture: ComponentFixture<UBSInputErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UBSInputErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UBSInputErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
