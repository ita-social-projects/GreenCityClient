import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoreFormComponent } from './restore-form.component';

describe('RestoreFormComponent', () => {
  let component: RestoreFormComponent;
  let fixture: ComponentFixture<RestoreFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestoreFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestoreFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
